import React from 'react';
import { ShieldCheck, MapPin, ScanFace, Database, Lock } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SecurityProps {
  lang: Language;
}

export const Security: React.FC<SecurityProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang].security;

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-4 animate-page-enter">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-xs font-bold tracking-widest uppercase animate-pulse">
           <Lock size={12} /> {t.badge}
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          {t.title}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-[fadeInUp_1s_0.2s]">
        
        {/* Card 1: GPS */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-eco-500/50 transition-colors">
           <div className="absolute top-0 right-0 p-20 bg-eco-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-eco-500/10 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
             <MapPin className="text-eco-500" size={32} />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t.features[0].title}</h3>
           <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
             {t.features[0].desc}
           </p>
           <div className="mt-8 flex items-center gap-2 text-xs font-mono text-eco-500 bg-eco-500/10 w-fit px-3 py-1 rounded-md">
             <div className="w-2 h-2 bg-eco-500 rounded-full animate-ping"></div>
             LIVE GEO-FENCING ACTIVE
           </div>
        </div>

        {/* Card 2: AI Shield */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-colors">
           <div className="absolute top-0 right-0 p-20 bg-blue-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-blue-500/10 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
             <ScanFace className="text-blue-500" size={32} />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t.features[1].title}</h3>
           <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
             {t.features[1].desc}
           </p>
           <div className="mt-8 flex items-center gap-2 text-xs font-mono text-blue-500 bg-blue-500/10 w-fit px-3 py-1 rounded-md">
             <ShieldCheck size={12} />
             NEURAL NET PROTECTION
           </div>
        </div>

        {/* Card 3: Blockchain */}
        <div className="glass-card p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
           <div className="absolute top-0 right-0 p-20 bg-purple-500/5 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:bg-purple-500/10 transition-colors"></div>
           <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-8 relative z-10 shadow-lg group-hover:scale-110 transition-transform duration-500">
             <Database className="text-purple-500" size={32} />
           </div>
           <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t.features[2].title}</h3>
           <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
             {t.features[2].desc}
           </p>
           <div className="mt-8 flex items-center gap-2 text-xs font-mono text-purple-500 bg-purple-500/10 w-fit px-3 py-1 rounded-md">
             <Lock size={12} />
             IMMUTABLE LEDGER
           </div>
        </div>

      </div>

      {/* Footer Text */}
      <div className="text-center border-t border-slate-200 dark:border-white/10 pt-10">
        <p className="text-xs md:text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
          {t.footer}
        </p>
      </div>
    </div>
  );
};