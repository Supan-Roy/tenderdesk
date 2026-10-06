import React from 'react';
import { useI18n } from '@/i18n';
import { FileCheck2, Globe, Lock } from 'lucide-react';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Brand Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-sm shadow-blue-500/20 border border-blue-400/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">{t.app.title}</h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 font-semibold uppercase tracking-wider">
                  {t.app.tagline}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">{t.app.subtitle}</p>
            </div>
          </div>

          {/* Privacy & Language Controls */}
          <div className="flex items-center space-x-3.5">
            <div className="hidden md:flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50/90 px-3 py-1.5 rounded-full border border-emerald-200/80 font-semibold shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.app.privacyBadge}</span>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`flex items-center space-x-1.5 px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  language === 'en'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.nav.english}</span>
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                  language === 'bn'
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
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
