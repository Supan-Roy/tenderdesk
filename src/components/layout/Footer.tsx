import React from 'react';
import { ShieldCheck, FileCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">TenderDesk</span>
          <span>— Browser-Side Tender Document Package Builder</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero server storage • Entirely local execution</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
