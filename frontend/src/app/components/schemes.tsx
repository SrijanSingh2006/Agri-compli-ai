import React from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  TrendingUp,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export function Schemes() {
  const recommendedSchemes = [
    {
      id: 1,
      title: 'Credit Guarantee Scheme (CGS)',
      provider: 'MSME Ministry',
      eligibility: 'New and existing MSMEs engaged in manufacturing or service activities.',
      benefits: 'Collateral-free credit facility up to ₹500 Lakhs.',
      matchScore: 98,
      tags: ['Financing', 'Manufacturing']
    },
    {
      id: 2,
      title: 'Digital MSME Scheme',
      provider: 'Ministry of Electronics & IT',
      eligibility: 'Registered MSMEs looking to adopt digital technologies.',
      benefits: 'Subsidies on cloud services and software implementation.',
      matchScore: 85,
      tags: ['Technology', 'Digitization']
    },
    {
      id: 3,
      title: 'ZED Certification Scheme',
      provider: 'QCI / Ministry of MSME',
      eligibility: 'Any MSME with a valid Udyam registration.',
      benefits: 'Financial assistance for certification and quality improvement.',
      matchScore: 72,
      tags: ['Quality', 'Sustainability']
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">AI Recommended</span>
          <h2 className="text-3xl font-bold mb-4">Discover Optimized Government Support</h2>
          <p className="text-blue-100 mb-6">Based on your tech profile and business size, we've identified {recommendedSchemes.length} schemes you are eligible for today.</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
            Start Eligibility Check
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-12 translate-x-12"></div>
        <Lightbulb className="absolute right-12 top-1/2 -translate-y-1/2 text-white/10 w-48 h-48 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedSchemes.map((scheme) => (
          <motion.div 
            key={scheme.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  {scheme.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                  <Award size={14} /> {scheme.matchScore}% Match
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{scheme.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{scheme.provider}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligibility</h4>
                  <p className="text-sm text-slate-700 line-clamp-2">{scheme.eligibility}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <TrendingUp size={14} className="text-emerald-500" /> Benefits
                  </h4>
                  <p className="text-sm text-slate-700 font-medium">{scheme.benefits}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold text-sm hover:underline">
                View Full Details <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Users size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Need expert assistance?</h4>
            <p className="text-sm text-slate-500">Our consultants can help you with the application process.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          Talk to Consultant
        </button>
      </div>
    </div>
  );
}
