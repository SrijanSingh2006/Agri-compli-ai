import React from 'react';
import { 
  FileText, 
  ChevronRight, 
  ExternalLink, 
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function ComplianceGuidance() {
  const steps = [
    {
      title: 'Gather Business Details',
      desc: 'Collect basic information like PAN, Aadhaar of directors, and address proof.',
      docs: ['PAN Card', 'Director Identification Number (DIN)']
    },
    {
      title: 'Digital Signature Certificate',
      desc: 'Obtain DSC for directors to sign electronic documents.',
      docs: ['Identity Proof', 'Address Proof']
    },
    {
      title: 'File SPICe+ Form',
      desc: 'Submit integrated application for name reservation and incorporation.',
      docs: ['MOA', 'AOA', 'Consent Letters']
    },
    {
      title: 'Obtain Certificate of Incorporation',
      desc: 'Receive official registration document from the Registrar of Companies.',
      docs: ['Certificate of Incorporation']
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Step-by-Step Filing: GSTR-1</h2>
          <p className="text-slate-500 mb-6">Follow these instructions to file your monthly outward supplies return accurately.</p>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.375rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-6 group">
                <div className="flex items-center justify-center w-11 h-11 rounded-full border-4 border-white bg-blue-100 text-blue-600 font-bold z-10">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="text-lg font-semibold text-slate-800 mb-1">{step.title}</h4>
                  <p className="text-slate-500 text-sm mb-3 leading-relaxed">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.docs.map((doc, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium flex items-center gap-1">
                        <FileText size={12} /> {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-200">
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Info size={20} /> Quick Link
          </h3>
          <p className="text-blue-100 text-sm mb-6">Direct access to the official Government compliance portal for GST filings.</p>
          <a 
            href="https://www.gst.gov.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full bg-white text-blue-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
          >
            Go to Official Portal <ExternalLink size={18} />
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold mb-4">Required Documents</h3>
          <div className="space-y-3">
            {[
              { name: 'Purchase Invoices', status: 'ready' },
              { name: 'Sales Register', status: 'missing' },
              { name: 'Bank Statement', status: 'ready' },
              { name: 'Previous Return', status: 'ready' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{doc.name}</span>
                </div>
                {doc.status === 'ready' ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-blue-600 text-sm font-bold flex items-center justify-center gap-1 hover:underline">
            Manage Document Storage <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
