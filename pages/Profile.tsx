import React from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS, MOCK_HISTORY } from '../constants';
import { Wallet, Recycle, Calendar, ArrowUpRight, ArrowDownLeft, Leaf } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  lang: Language;
}

export const Profile: React.FC<ProfileProps> = ({ user, lang }) => {
  const t = TRANSLATIONS[lang].profile;

  if (!user) return <div className="text-center pt-32 text-slate-400">Please login to view profile.</div>;

  return (
    <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="md:col-span-3 bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Leaf size={200} className="text-emerald-400" />
           </div>
           
           <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-emerald-500/30 flex items-center justify-center text-3xl font-bold text-white shadow-xl z-10">
             {user.name.charAt(0).toUpperCase()}
           </div>
           
           <div className="flex-1 text-center md:text-left z-10">
             <h1 className="text-3xl font-bold text-white mb-1">{user.name}</h1>
             <p className="text-emerald-400 font-medium uppercase tracking-wider text-sm">{user.role === 'admin' ? 'Government Official' : 'Eco Citizen'}</p>
             
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-6">
                <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-700/50">
                   <Wallet className="text-yellow-400" size={20} />
                   <div>
                      <p className="text-xs text-slate-400">{t.balance}</p>
                      <p className="text-lg font-bold text-white">{user.balance.toLocaleString()} UZS</p>
                   </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 px-4 py-2 rounded-lg border border-slate-700/50">
                   <Recycle className="text-emerald-400" size={20} />
                   <div>
                      <p className="text-xs text-slate-400">{t.recycled}</p>
                      <p className="text-lg font-bold text-white">{user.totalRecycledKg} kg</p>
                   </div>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-slate-400" />
          {t.history}
        </h2>

        <div className="space-y-4">
          {MOCK_HISTORY.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'earn' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                   {item.type === 'earn' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <p className="text-white font-bold">{item.description}</p>
                  <p className="text-xs text-slate-500">{item.date}</p>
                </div>
              </div>
              <div className={`text-right font-bold ${item.type === 'earn' ? 'text-emerald-400' : 'text-slate-300'}`}>
                {item.type === 'earn' ? '+' : ''}{item.amount.toLocaleString()} UZS
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};