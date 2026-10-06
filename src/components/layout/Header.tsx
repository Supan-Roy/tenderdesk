import React from 'react';
import { useI18n } from '@/i18n';
import { FileCheck2, Globe, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{t.app.title}</h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  {t.app.tagline}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">{t.app.subtitle}</p>
            </div>
          </div>

          {/* Privacy & Language Selector */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{t.app.privacyBadge}</span>
            </div>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.nav.english}</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'bn'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t.nav.bangla}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
