const db = require('../config/db');
const Document = require('../models/Document');

exports.getComplianceStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role || 'Farmer';

    let rules = [];
    try {
      // Prefer role-aware query when schema contains `applicable_role`.
      const [roleRules] = await db.execute(
        "SELECT * FROM compliance_rules WHERE applicable_role = ? OR applicable_role = 'ALL'",
        [userRole]
      );
      rules = roleRules;
    } catch (queryErr) {
      // Backward compatibility for older databases without `applicable_role`.
      if (queryErr && queryErr.code === 'ER_BAD_FIELD_ERROR') {
        const [allRules] = await db.execute('SELECT * FROM compliance_rules');
        rules = allRules;
      } else {
        throw queryErr;
      }
    }

    const userDocs = await Document.findByUserId(userId);
    const userTags = userDocs.map((d) => d.tag);

    const status = rules.map((rule) => {
      const hasDoc = userTags.includes(rule.required_doc_tag);
      return {
        ruleName: rule.rule_name,
        requiredDoc: rule.required_doc_tag,
        isCompliant: hasDoc,
        dueDate: rule.due_date,
        penalty: hasDoc ? 'None' : 'Rs100/day',
      };
    });

    res.json(status);
  } catch (err) {
    console.error('Compliance Check Error:', err);
    res.status(500).json({ error: err.message });
  }
};
