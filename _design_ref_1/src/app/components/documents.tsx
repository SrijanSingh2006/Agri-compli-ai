import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Link as LinkIcon,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';

export function Documents() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'GST_Certificate.pdf', type: 'Certificate', size: '2.4 MB', date: 'Jan 12, 2026', linkedTo: 'GSTR-1' },
    { id: 2, name: 'Incorporation_Doc.pdf', type: 'Legal', size: '5.1 MB', date: 'Jan 10, 2026', linkedTo: 'General' },
    { id: 3, name: 'PAN_Card_Business.png', type: 'ID Proof', size: '0.8 MB', date: 'Jan 10, 2026', linkedTo: 'TDS Payment' },
    { id: 4, name: 'Bank_Statement_Jan.pdf', type: 'Financial', size: '3.2 MB', date: 'Feb 02, 2026', linkedTo: 'Audit' },
  ]);

  const handleUpload = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Uploading document...',
        success: 'Document uploaded successfully!',
        error: 'Upload failed.',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Document Storage</h2>
          <p className="text-slate-500 text-sm">Securely store and manage your compliance-related documents.</p>
        </div>
        <button 
          onClick={handleUpload}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-shadow shadow-lg shadow-blue-200"
        >
          <Upload size={18} /> Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Files', value: '24', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Used Space', value: '42%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Docs', value: '3', icon: Filter, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Security Status', value: 'Encrypted', icon: LinkIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between bg-slate-50/30">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1-2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Document Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">Linked To</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <span className="text-sm font-semibold text-slate-800">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{doc.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{doc.size}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{doc.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                      {doc.linkedTo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-slate-400">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
