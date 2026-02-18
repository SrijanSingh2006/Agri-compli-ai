const axios = require('axios');
const db = require('../config/db');
const Document = require('../models/Document');

const PYTHON_SERVICE_URL = process.env.PYTHON_URL || 'http://localhost:5001';

const DEFAULT_LOANS = [
  {
    name: 'SBI Kisan Credit Card',
    bank: 'State Bank of India',
    interest_rate: '7% p.a.',
    description: 'Short-term crop credit for input and working capital.',
    required_docs: ['Aadhaar', 'PAN', 'LandRecord'],
  },
  {
    name: 'PNB Agri Term Loan',
    bank: 'Punjab National Bank',
    interest_rate: '9.5% p.a.',
    description: 'Loan for irrigation, farm equipment, and allied activities.',
    required_docs: ['Aadhaar', 'PAN', 'BankStatement', 'LandRecord'],
  },
  {
    name: 'NABARD Linked Farm Mechanization',
    bank: 'Public Sector Banks',
    interest_rate: '8.75% p.a.',
    description: 'Support for tractor and machinery purchase with subsidy links.',
    required_docs: ['Aadhaar', 'Quotation', 'BankStatement'],
  },
];

const toArray = (value) => (Array.isArray(value) ? value : []);

const parseRequiredDocs = (item) => {
  if (Array.isArray(item.required_docs)) return item.required_docs;

  if (typeof item.required_docs_json === 'string') {
    try {
      const parsed = JSON.parse(item.required_docs_json);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  if (Array.isArray(item.required_docs_json)) return item.required_docs_json;

  return [];
};

const enrichOpportunity = (item, userTags) => {
  const requiredDocs = parseRequiredDocs(item);
  const missingDocs = requiredDocs.filter((doc) => !userTags.includes(doc));
  const matchScore = requiredDocs.length
    ? Math.round(((requiredDocs.length - missingDocs.length) / requiredDocs.length) * 100)
    : item.match_score || 80;

  return {
    ...item,
    required_docs: requiredDocs,
    missing_docs: missingDocs,
    match_score: matchScore,
    is_eligible: missingDocs.length === 0,
  };
};

const fallbackRecommendations = async (userTags) => {
  const [rows] = await db.execute('SELECT scheme_name, description, required_docs_json FROM schemes');
  const schemes = rows.map((row) =>
    enrichOpportunity(
      {
        name: row.scheme_name,
        description: row.description || 'Government support program for farm growth.',
        type: 'Central/State Scheme',
        required_docs_json: row.required_docs_json,
      },
      userTags
    )
  );

  const loans = DEFAULT_LOANS.map((loan) => enrichOpportunity(loan, userTags));
  return { schemes, loans };
};

exports.getEligibleSchemes = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'Farmer';
    const userDocs = await Document.findByUserId(userId);
    const userTags = userDocs.map((d) => d.tag);

    try {
      const response = await axios.post(
        `${PYTHON_SERVICE_URL}/recommend`,
        {
          user_docs: userTags,
          profile: { role: userRole, location: 'India' },
        },
        { timeout: 10000 }
      );

      const data = response.data || {};
      const schemes = toArray(data.schemes).map((item) => enrichOpportunity(item, userTags));
      const loans = toArray(data.loans).map((item) => enrichOpportunity(item, userTags));

      return res.json({ schemes, loans });
    } catch (mlError) {
      console.warn('ML recommend unavailable, using fallback:', mlError.message);
      const fallback = await fallbackRecommendations(userTags);
      return res.json(fallback);
    }
  } catch (err) {
    console.error('Scheme Fetch Error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch schemes' });
  }
};

exports.checkLoanEligibility = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'Farmer';
    const userDocs = await Document.findByUserId(userId);
    const userTags = userDocs.map((d) => d.tag);

    const loanDetails = req.body.loanDetails || req.body || {};
    const amount = Number(loanDetails.amount || 0);

    try {
      const response = await axios.post(
        `${PYTHON_SERVICE_URL}/growth/advanced-check`,
        {
          amount: loanDetails.amount,
          tenure: loanDetails.tenure,
          bank: loanDetails.bank,
          user_docs: userTags.map((tag) => ({ tag })),
          role: userRole,
        },
        { timeout: 10000 }
      );

      return res.json(response.data);
    } catch (mlError) {
      console.warn('ML eligibility unavailable, using heuristic:', mlError.message);

      const required = ['Aadhaar', 'PAN', 'LandRecord', 'BankStatement'];
      const missing = required.filter((doc) => !userTags.includes(doc));
      const coverage = (required.length - missing.length) / required.length;
      const amountPenalty = amount >= 1000000 ? 10 : amount >= 500000 ? 5 : 0;
      const confidence = Math.max(20, Math.min(98, Math.round(55 + coverage * 40 - amountPenalty)));
      const eligible = coverage >= 0.5;

      return res.json({
        eligible,
        confidence_score: confidence,
        analyzed_docs_count: userTags.length,
        reasoning: eligible
          ? 'Core document coverage is acceptable for initial lender screening.'
          : 'Document coverage is low for most lenders and schemes.',
        suggestion:
          missing.length > 0
            ? `Upload these first: ${missing.join(', ')}.`
            : 'Compare final terms across 2-3 lenders before applying.',
        missing_docs: missing,
      });
    }
  } catch (err) {
    console.error('Eligibility Check Error:', err.message);
    return res.status(500).json({ error: 'Eligibility check failed' });
  }
};
