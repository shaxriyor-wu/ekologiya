import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hexagon, Globe, Zap, Shield } from 'lucide-react';
import { Language, GlobalStats } from '../types';
import { TRANSLATIONS } from '../constants';
import { AuthService } from '../services/authService';

interface HomeProps {
  lang: Language;
}

export const Home: React.FC<HomeProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const [stats, setStats] = useState<GlobalStats>({
    totalUsers: 142050,
    totalWasteCollected: 5890,
    totalPayouts: 850000000,
    co2Saved: 2100
  });

  useEffect(() => {
    AuthService.getGlobalStats().then(setStats).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden pb-20">
        
        {/* Floating Background Elements - Made more subtle and positioned to not interfere with text */}
        <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-eco-500/10 rounded-full blur-[80px] md:blur-[120px] top-0 left-0 md:-top-20 md:-left-20 animate-pulse-slow z-0"></div>
        <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-blue-500/10 rounded-full blur-[60px] md:blur-[100px] bottom-20 right-0 animate-float z-0"></div>

        <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6 md:space-y-8 mt-4 md:mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-eco-500/30 text-eco-500 text-[10px] md:text-xs font-bold tracking-widest uppercase animate-[fadeInDown_1s] hover:bg-eco-500/10 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-eco-500 animate-pulse"></span>
            Official Govt Protocol 2.0
          </div>
          
          {/* Fixed Text Sizing for Mobile */}
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-display font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] md:leading-tight animate-[fadeInUp_1s_0.2s]">
            <span className="text-gradient hover-trigger cursor-default block md:inline">{t.hero.title}</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-[fadeInUp_1s_0.4s] px-4">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-[fadeInUp_1s_0.6s] w-full px-4">
            <Link 
              to="/login" 
              className="group w-full sm:w-auto relative px-8 py-4 bg-eco-500 hover:bg-eco-400 text-white md:text-slate-900 font-bold rounded-xl md:rounded-full transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-eco-500/25"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">{t.hero.cta}</span>
              <ArrowRight className="relative transition-transform group-hover:translate-x-1" size={20} />
            </Link>
            
            <button className="w-full sm:w-auto px-8 py-4 text-slate-500 dark:text-slate-300 hover:text-eco-500 dark:hover:text-white font-medium transition-colors flex items-center justify-center gap-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl md:rounded-full">
              {t.hero.secondary}
            </button>
          </div>
        </div>

        {/* Global Stats Ribbon */}
        <div className="absolute bottom-0 w-full border-t border-slate-200 dark:border-white/5 glass bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl z-20">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group cursor-default">
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1 group-hover:text-eco-500 transition-colors">{t.stats.collected}</p>
              <p className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{stats.totalWasteCollected.toLocaleString()} T</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1 group-hover:text-eco-500 transition-colors">{t.stats.payouts}</p>
              <p className="text-xl md:text-2xl font-display font-bold text-eco-500 group-hover:scale-110 transition-transform">{stats.totalPayouts.toLocaleString()}</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1 group-hover:text-eco-500 transition-colors">{t.stats.users}</p>
              <p className="text-xl md:text-2xl font-display font-bold text-blue-500 group-hover:scale-110 transition-transform">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="text-center group cursor-default">
              <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mb-1 group-hover:text-eco-500 transition-colors">{t.stats.co2}</p>
              <p className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white group-hover:scale-110 transition-transform">{stats.co2Saved.toLocaleString()} T</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="glass-card p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:border-eco-500/30">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-eco-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg shadow-eco-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Zap className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4 group-hover:text-eco-500 transition-colors">Instant EcoCoins</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                Scan waste, get paid instantly. Our AI verifies material type and weight in milliseconds, depositing crypto-assets directly to your wallet.
              </p>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:border-blue-500/30">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-transform">
                <Globe className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-500 transition-colors">Govt Integrated</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                Seamlessly connected with municipal services. Your recycling data contributes directly to national sustainability goals and tax incentives.
              </p>
            </div>

            <div className="glass-card p-8 md:p-10 rounded-3xl hover:-translate-y-2 transition-all duration-300 group hover:border-purple-500/30">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4 group-hover:text-purple-500 transition-colors">Secure & Transparent</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                Blockchain-backed ledger ensures every gram of recycled material is accounted for. No fraud, just pure impact.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};