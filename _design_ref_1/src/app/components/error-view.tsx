import React from 'react';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

interface ErrorViewProps {
  message?: string;
  onRetry?: () => void;
  onHome?: () => void;
}

export function ErrorView({ 
  message = "Something went wrong while fetching your compliance data. Please try again or contact support if the problem persists.", 
  onRetry, 
  onHome 
}: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Unable to Load Content</h2>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <button 
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw size={18} /> Retry Connection
        </button>
        <button 
          onClick={onHome}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
        >
          <Home size={18} /> Back to Dashboard
        </button>
      </div>
      <p className="mt-8 text-xs text-slate-400">Error Code: ERR_CONN_REFUSED_MSME_API</p>
    </div>
  );
}
