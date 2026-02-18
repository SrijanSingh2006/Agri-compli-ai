import React from 'react';
import { 
  HandCoins, 
  Search, 
  ArrowRightLeft, 
  TrendingDown, 
  ShieldCheck,
  Building,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export function Loans() {
  const loans = [
    {
      id: 1,
      bank: 'HDFC Bank',
      logo: 'https://images.unsplash.com/photo-1541354346781-b9c1032d4471?w=64&h=64&fit=crop',
      product: 'MSME Growth Loan',
      rate: '8.45% - 10.5%',
      tenure: 'Up to 5 years',
      amount: '₹10L - ₹50L',
      purpose: 'Working Capital',
      features: ['No collateral for up to 25L', 'Fast processing', 'Digital application']
    },
    {
      id: 2,
      bank: 'SIDBI',
      logo: 'https://images.unsplash.com/photo-1454165833767-027508492021?w=64&h=64&fit=crop',
      product: 'SPEED Plus',
      rate: '6.75% onwards',
      tenure: 'Up to 3 years',
      amount: '₹25L - ₹2Cr',
      purpose: 'Machinery Purchase',
      features: ['Direct loan', 'Low interest for tech units', 'Minimal paperwork']
    },
    {
      id: 3,
      bank: 'ICICI Bank',
      logo: 'https://images.unsplash.com/photo-1611095773163-97a30b1a9245?w=64&h=64&fit=crop',
      product: 'Business Insta Loan',
      rate: '9.2% onwards',
      tenure: 'Up to 7 years',
      amount: 'Up to ₹2Cr',
      purpose: 'Expansion',
      features: ['Instant sanction', 'Overdraft facility', 'Relationship manager']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Recommended Financing</h2>
          <p className="text-slate-500">Curated loan offers from banks and NBFCs based on your eligibility.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search loans..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
            <ArrowRightLeft size={18} /> Compare All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loans.map((loan) => (
          <motion.div 
            key={loan.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-blue-200 transition-all group"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex items-center gap-4 lg:w-1/4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                  <Building className="text-slate-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{loan.bank}</h3>
                  <p className="text-sm text-slate-500">{loan.product}</p>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-slate-50 lg:border-y-0 lg:py-0">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Interest Rate</p>
                  <p className="text-lg font-bold text-blue-600">{loan.rate}</p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <TrendingDown size={10} /> Competitive
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Max Amount</p>
                  <p className="text-lg font-bold text-slate-800">{loan.amount}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tenure</p>
                  <p className="text-lg font-bold text-slate-800">{loan.tenure}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Purpose</p>
                  <p className="text-lg font-bold text-slate-800">{loan.purpose}</p>
                </div>
              </div>

              <div className="lg:w-1/4 flex flex-col justify-center">
                <button className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors mb-2">
                  Apply Now
                </button>
                <div className="flex items-center justify-center gap-1 text-slate-400 text-xs">
                  <ShieldCheck size={14} className="text-emerald-500" /> Pre-approved Match
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50 flex flex-wrap gap-4">
              {loan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full text-xs font-medium text-slate-600">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {feature}
                </div>
              ))}
              <div className="ml-auto">
                <button className="text-slate-400 hover:text-blue-600 flex items-center gap-1 text-xs font-bold transition-colors">
                  <Info size={14} /> Eligibility Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
