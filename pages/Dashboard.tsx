import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { Language, User, Transaction, GlobalStats } from '../types';
import { AuthService } from '../services/authService';
import { Wallet, Trophy, TrendingUp, Activity, Globe, Zap, Droplets, Flame, Trash2, Check, AlertCircle, Clock, ArrowDownLeft, ArrowUpRight, UserX, Search, Download, Printer, X } from 'lucide-react';
import { ToastContainer, ToastType } from '../components/Toast';
import { Confetti } from '../components/Confetti';
import { AnimatedNumber } from '../components/AnimatedNumber';

// Simulated Graph Data
const activityData = [
  { name: 'Mon', coins: 12000 },
  { name: 'Tue', coins: 18000 },
  { name: 'Wed', coins: 15000 },
  { name: 'Thu', coins: 25000 },
  { name: 'Fri', coins: 30000 },
  { name: 'Sat', coins: 40000 },
  { name: 'Sun', coins: 38000 },
];

interface DashboardProps {
  lang: Language;
  user: User;
  setUser: (u: User) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ lang, user, setUser }) => {
  const t = TRANSLATIONS[lang].dashboard;
  const ts = TRANSLATIONS[lang].stats;
  const navigate = useNavigate();

  // Tabs
  const [activeTab, setActiveTab] = useState<'stats' | 'payments' | 'history'>('stats');

  // Global Stats State
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalUsers: 142050,
    totalWasteCollected: 5890,
    totalPayouts: 850000000,
    co2Saved: 2100
  });

  // Bill Payment States
  const [provider, setProvider] = useState<'Elektr' | 'Gaz' | 'Suv' | 'Musor'>('Elektr');
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [paying, setPaying] = useState(false);
  const [payMessage, setPayMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // History State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'earn' | 'spend'>('all');
  
  // Delete Account State
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Toast Notifications
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  // Toast helper
  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (activeTab === 'history') {
          const searchInput = document.querySelector('input[type="text"][placeholder*="Qidirish"]') as HTMLInputElement;
          searchInput?.focus();
        }
      }
      // ESC to close modals
      if (e.key === 'Escape') {
        setShowDeleteConfirm(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Load global stats on mount
  useEffect(() => {
    AuthService.getGlobalStats().then(setGlobalStats).catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      setLoadingTransactions(true);
      AuthService.getTransactions()
        .then(setTransactions)
        .catch(console.error)
        .finally(() => setLoadingTransactions(false));
    }
  }, [activeTab]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayMessage(null);
    try {
      if (!accountNo.trim()) {
        setPayMessage({ type: 'error', text: 'Hisob raqamini kiriting' });
        showToast('Hisob raqamini kiriting', 'error');
        setPaying(false);
        return;
      }
      
      if (!amount || Number(amount) <= 0) {
        setPayMessage({ type: 'error', text: 'Summa kiritilmagan yoki noto\'g\'ri' });
        showToast('Summa kiritilmagan yoki noto\'g\'ri', 'error');
        setPaying(false);
        return;
      }
      
      if (Number(amount) > user.balance) {
        setPayMessage({ type: 'error', text: 'Mablag\' yetarli emas!' });
        showToast('Mablag\' yetarli emas!', 'error');
        setPaying(false);
        return;
      }
      
      console.log('🔄 To\'lov amalga oshirilmoqda...', { provider, accountNo, amount });
      
      const result = await AuthService.payUtility(user.id, provider, accountNo.trim(), Number(amount));
      
      console.log('✅ To\'lov natijasi:', result);
      
      // Update user state
      if (result.user) {
        setUser(result.user);
      }
      
      // Show success message
      const successMessage = result.message || "To'lov muvaffaqiyatli amalga oshirildi!";
      setPayMessage({ 
        type: 'success', 
        text: successMessage
      });
      showToast(successMessage, 'success');
      
      // Clear form and trigger confetti
      setAmount('');
      setAccountNo('');
      setConfettiTrigger(true);
      
    } catch (err: any) {
      console.error('❌ To\'lov xatosi:', err);
      const errorMessage = err.message || "To'lov amalga oshirilmadi. Xatolik yuz berdi";
      setPayMessage({ type: 'error', text: errorMessage });
      showToast(errorMessage, 'error');
    } finally {
      setPaying(false);
    }
  };

  // Format Date with Seconds
  const formatFullTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    setDeletingAccount(true);
    try {
      await AuthService.deleteAccount(user.id);
      setUser(null);
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Hisobni o\'chirishda xatolik yuz berdi');
    } finally {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = searchQuery === '' || 
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.provider?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Export transactions
  const handleExport = () => {
    const csv = [
      ['Turi', 'Tavsif', 'Manba', 'Vaqt', 'Summa'].join(','),
      ...filteredTransactions.map(tx => [
        tx.type === 'earn' ? 'Kirim' : 'Chiqim',
        `"${tx.description}"`,
        `"${tx.provider || ''}"`,
        `"${formatFullTime(tx.date)}"`,
        tx.amount
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ecocash-tranzaksiyalar-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Tranzaksiyalar eksport qilindi!', 'success');
  };

  // Print transactions
  const handlePrint = () => {
    window.print();
    showToast('Chop etish tayyorlandi!', 'info');
  };

  return (
    <div className="pt-28 pb-12 px-4 max-w-7xl mx-auto">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white transition-colors">{t.welcome}, {user.name}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">EcoCash System Status: <span className="text-eco-500 font-bold">ONLINE</span></p>
        </div>
        <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-full overflow-x-auto">
           {['stats', 'payments', 'history'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === tab ? 'bg-eco-500 text-white shadow-lg shadow-eco-500/25' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
             >
               {tab === 'stats' ? 'Statistika' : tab === 'payments' ? "To'lovlar" : 'Tarix'}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="animate-page-enter">
        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={80} className="text-eco-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t.balance}</p>
            <div className="flex items-end gap-2">
              <AnimatedNumber 
                value={user.balance} 
                className="text-4xl font-display font-bold text-slate-900 dark:text-white"
                duration={800}
              />
              <span className="text-lg text-eco-500 font-bold mb-1">UZS</span>
            </div>
            <div className="mt-4 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-eco-500 transition-all duration-1000 ease-out"
                style={{ width: '70%' }}
              ></div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Trophy size={80} className="text-yellow-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t.level}</p>
            <AnimatedNumber 
              value={user.level} 
              className="text-4xl font-display font-bold text-slate-900 dark:text-white"
              duration={600}
            />
            <p className="text-sm text-slate-500 mt-2">Elite Recycler Status</p>
          </div>

          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Activity size={80} className="text-blue-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">{t.impact}</p>
            <div className="flex items-end gap-2">
              <AnimatedNumber 
                value={user.totalRecycledKg} 
                className="text-4xl font-display font-bold text-slate-900 dark:text-white"
                duration={800}
                decimals={1}
              />
              <span className="text-xl">kg</span>
            </div>
            <p className="text-sm text-slate-500 mt-2">Lifetime Contribution</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Personal Activity Chart */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-eco-500" />
                {t.history}
              </h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorCoins" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '12px' }} 
                  />
                  <Area type="monotone" dataKey="coins" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCoins)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Global/Govt Stats */}
          <div className="glass-card p-6 rounded-3xl border border-blue-500/20">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              {t.global}
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{ts.collected}</span>
                  <span className="text-slate-900 dark:text-white font-bold">{globalStats.totalWasteCollected.toLocaleString()} T</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-500 dark:text-slate-400">{ts.co2}</span>
                  <span className="text-slate-900 dark:text-white font-bold">{globalStats.co2Saved.toLocaleString()} T</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-eco-500 transition-all duration-1000 ease-out"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl mt-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{ts.payouts}</p>
                <p className="text-2xl font-display font-bold text-slate-900 dark:text-white">{globalStats.totalPayouts.toLocaleString()} <span className="text-xs text-slate-500">UZS</span></p>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-8 animate-page-enter">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Utility Payment Section */}
          <div className="glass-card p-8 rounded-3xl md:col-span-2">
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="text-yellow-500" /> Komunal To'lovlar
            </h2>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { id: 'Elektr', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { id: 'Gaz', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { id: 'Suv', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { id: 'Musor', icon: Trash2, color: 'text-gray-500', bg: 'bg-gray-500/10' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setProvider(item.id as any)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                    provider === item.id 
                    ? `border-eco-500 ${item.bg} shadow-lg shadow-eco-500/20` 
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  <item.icon className={item.color} size={24} />
                  <span className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-300">{item.id}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold ml-1">
                  {provider === 'Elektr' ? 'Elektr Hisob Raqami' : 
                   provider === 'Gaz' ? 'Gaz Hisob Raqami' :
                   provider === 'Suv' ? 'Suv Hisob Raqami' :
                   'Musor Hisob Raqami'}
                </label>
                <input 
                  type="text" 
                  placeholder={provider === 'Elektr' ? 'Masalan: 123456789' : 'Hisob raqamni kiriting'} 
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-eco-500"
                  value={accountNo}
                  onChange={e => setAccountNo(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-500 font-bold ml-1">Summa (EcoCoin/UZS)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0" 
                    required
                    className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-eco-500"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                  />
                  <span className="absolute right-4 top-3.5 text-slate-400 text-sm font-bold">UZS</span>
                </div>
                <p className="text-xs text-slate-400 text-right">Balans: {user.balance.toLocaleString()} UZS</p>
              </div>

              {payMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${
                  payMessage.type === 'success' 
                    ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                    : 'bg-red-500/20 text-red-500 border-red-500/30'
                }`}>
                   {payMessage.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                   <span className="flex-1">{payMessage.text}</span>
                </div>
              )}

              <button 
                disabled={paying}
                className="w-full bg-eco-500 hover:bg-eco-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-eco-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paying ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "To'lash"
                )}
              </button>
            </form>
          </div>
          </div>
          
          {/* Delete Account Section */}
          <div className="glass-card p-8 rounded-3xl border border-red-500/20">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <UserX className="text-red-500" /> Hisobni O'chirish
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Hisobni o'chirish orqali barcha ma'lumotlaringiz saqlanib qoladi, lekin siz tizimga kirish imkoniyatini yo'qotasiz.
            </p>
            {showDeleteConfirm ? (
              <div className="space-y-4">
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-500 font-bold mb-2">⚠️ Eslatma:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Hisobni o'chirishni tasdiqlaysizmi? Bu amalni bekor qilib bo'lmaydi.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {deletingAccount ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Trash2 size={18} />
                        Ha, O'chirish
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deletingAccount}
                    className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl transition-all"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 rounded-xl transition-all border border-red-500/30 flex items-center justify-center gap-2"
              >
                <UserX size={18} />
                Hisobni O'chirish
              </button>
            )}
          </div>
        </div>
      )}

      {/* NEW HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="glass-card rounded-3xl overflow-hidden animate-page-enter">
          <div className="p-8 border-b border-slate-200 dark:border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="text-blue-500" /> Moliya Tarixi
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Barcha kirim va chiqim amallari soniyasigacha</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
                  title="Eksport qilish (CSV)"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Eksport</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
                  title="Chop etish"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Chop etish</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Qidirish (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-eco-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                {(['all', 'earn', 'spend'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-eco-500 text-white shadow-lg shadow-eco-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'Barchasi' : type === 'earn' ? 'Kirim' : 'Chiqim'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loadingTransactions ? (
              <div className="p-12 text-center text-slate-500">
                <span className="w-8 h-8 border-2 border-eco-500/30 border-t-eco-500 rounded-full animate-spin mx-auto block mb-4"></span>
                <p>Yuklanmoqda...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div>
                <div className="px-8 py-3 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filteredTransactions.length} ta tranzaksiya topildi
                    {searchQuery && ` "${searchQuery}" bo'yicha`}
                  </p>
                </div>
                <div className="hidden md:block">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="px-4 sm:px-8 py-4">Turi</th>
                        <th className="px-4 sm:px-8 py-4">Tavsif / Manba</th>
                        <th className="px-4 sm:px-8 py-4">Vaqt (Sana va Soat)</th>
                        <th className="px-4 sm:px-8 py-4 text-right">Summa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                      {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-4 sm:px-8 py-4">
                          <div className={`flex items-center gap-2 font-bold ${tx.type === 'earn' ? 'text-eco-500' : 'text-red-500'}`}>
                             {tx.type === 'earn' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                             {tx.type === 'earn' ? 'Kirim' : 'Chiqim'}
                          </div>
                        </td>
                        <td className="px-4 sm:px-8 py-4">
                          <p className="text-slate-900 dark:text-white font-medium">{tx.description}</p>
                          <p className="text-xs text-slate-500">{tx.provider}</p>
                        </td>
                        <td className="px-4 sm:px-8 py-4 text-slate-600 dark:text-slate-300 font-mono text-sm">
                          {formatFullTime(tx.date)}
                        </td>
                        <td className={`px-4 sm:px-8 py-4 text-right font-bold text-lg font-display ${tx.type === 'earn' ? 'text-eco-500' : 'text-red-500'}`}>
                          {tx.type === 'earn' ? '+' : ''}{tx.amount.toLocaleString()} UZS
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile View - Cards */}
                <div className="md:hidden space-y-4 p-4">
                  {filteredTransactions.map((tx) => (
                    <div key={tx.id} className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 border border-slate-200 dark:border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`flex items-center gap-2 font-bold ${tx.type === 'earn' ? 'text-eco-500' : 'text-red-500'}`}>
                          {tx.type === 'earn' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          {tx.type === 'earn' ? 'Kirim' : 'Chiqim'}
                        </div>
                        <div className={`text-right font-bold text-lg font-display ${tx.type === 'earn' ? 'text-eco-500' : 'text-red-500'}`}>
                          {tx.type === 'earn' ? '+' : ''}{tx.amount.toLocaleString()} UZS
                        </div>
                      </div>
                      <p className="text-slate-900 dark:text-white font-medium mb-1">{tx.description}</p>
                      {tx.provider && <p className="text-xs text-slate-500 mb-2">{tx.provider}</p>}
                      <p className="text-xs text-slate-500 font-mono">{formatFullTime(tx.date)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               <div className="p-8 sm:p-12 text-center text-slate-500">
                  <Clock size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm sm:text-base">
                    {searchQuery || filterType !== 'all' 
                      ? 'Qidiruv bo\'yicha tranzaksiyalar topilmadi.' 
                      : 'Hozircha tranzaksiyalar mavjud emas. Faoliyat Tarixi: 0'}
                  </p>
                  {(searchQuery || filterType !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('all');
                      }}
                      className="mt-4 px-4 py-2 bg-eco-500/10 hover:bg-eco-500/20 text-eco-500 rounded-xl transition-colors text-sm font-medium"
                    >
                      Filterni tozalash
                    </button>
                  )}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};