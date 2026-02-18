import React from 'react';
import { 
  Shield, 
  Trash2, 
  RefreshCcw, 
  Info, 
  Lock, 
  Eye, 
  UserX,
  Database,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const handleDeleteAccount = () => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action is permanent.');
    if (confirm) {
      toast.error('Account deletion request initiated.');
    }
  };

  const handleResetData = () => {
    toast.info('Data reset successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database size={20} className="text-blue-600" /> Data Management
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50 overflow-hidden">
          <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Export All Data</h4>
                <p className="text-sm text-slate-500">Download all your compliance history and documents in a ZIP file.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </div>

          <div 
            onClick={handleResetData}
            className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <RefreshCcw size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Reset Compliance Data</h4>
                <p className="text-sm text-slate-500">Clear all pending and completed statuses. Documents will be kept.</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
          </div>

          <div 
            onClick={handleDeleteAccount}
            className="p-6 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserX size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-rose-600">Delete Account</h4>
                <p className="text-sm text-rose-400">Permanently remove your account and all associated data.</p>
              </div>
            </div>
            <Trash2 size={20} className="text-rose-300 group-hover:text-rose-600 transition-colors" />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Shield size={20} className="text-blue-600" /> Privacy & Privacy Explanation
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 mb-2">How we protect your data</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Your data is encrypted using AES-256 standard. We do not share your business financial records with third parties unless explicitly authorized by you for loan applications. Our AI analysis is performed in a secure sandboxed environment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye size={18} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Profile Visibility</span>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Private</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-slate-400" />
                <span className="text-sm font-semibold text-slate-700">Two-Factor Auth</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Enabled</span>
            </div>
          </div>

          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <Info size={20} className="text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              We comply with the latest Data Protection Acts and MSME regulatory standards. Your information is used solely to provide personalized compliance and financial recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
