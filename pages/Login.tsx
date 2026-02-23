import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, ArrowRight, Lock, User as UserIcon, MapPin, Phone, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { AuthService } from '../services/authService';
import { ToastContainer, ToastType } from '../components/Toast';
import { Confetti } from '../components/Confetti';
import { UZBEKISTAN_REGIONS } from '../data/uzbekistanLocations';

interface LoginProps {
  lang: Language;
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ lang, onLogin }) => {
  const t = TRANSLATIONS[lang].auth;
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(true); // true = register, false = login
  const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '', region: '', district: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAutoLogin, setCheckingAutoLogin] = useState(true);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Telefon raqam formatlash: xx-xxx-xx-xx
  const formatPhone = (value: string) => {
    // Faqat raqamlarni qoldirish
    const digits = value.replace(/\D/g, '');
    // 9 ta raqamgacha (998 dan keyin)
    const limited = digits.slice(0, 9);
    // xx-xxx-xx-xx formatida chiqarish
    let formatted = '';
    if (limited.length > 0) formatted += limited.slice(0, 2);
    if (limited.length > 2) formatted += '-' + limited.slice(2, 5);
    if (limited.length > 5) formatted += '-' + limited.slice(5, 7);
    if (limited.length > 7) formatted += '-' + limited.slice(7, 9);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  // Auto-login check on mount
  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        const savedUser = localStorage.getItem('ecocash_current_user');
        const savedCredentials = localStorage.getItem('ecocash_credentials');

        if (savedUser && savedCredentials) {
          const credentials = JSON.parse(savedCredentials);
          try {
            const user = await AuthService.login(credentials.username || credentials.email, credentials.password);
            onLogin(user);
            navigate('/dashboard');
            return;
          } catch (err) {
            // Auto-login failed, clear saved data
            localStorage.removeItem('ecocash_credentials');
          }
        }
      } catch (err) {
        console.error('Auto-login check failed:', err);
      } finally {
        setCheckingAutoLogin(false);
      }
    };

    checkAutoLogin();
  }, [navigate, onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Telefon raqam tekshirish
        if (!formData.phone || formData.phone.replace(/\D/g, '').length < 9) {
          setError('Telefon raqam kiriting (xx-xxx-xx-xx)');
          showToast('Telefon raqam kiriting', 'error');
          setLoading(false);
          return;
        }

        if (!formData.password || formData.password.length < 6) {
          setError('Parol kamida 6 belgi bo\'lishi kerak');
          showToast('Parol kamida 6 belgi bo\'lishi kerak', 'error');
          setLoading(false);
          return;
        }

        // Telefon raqamdan email yaratish (backend uchun)
        const phoneDigits = formData.phone.replace(/\D/g, '');
        const generatedEmail = `998${phoneDigits}@ecocash.uz`;

        // Username yaratish (telefon raqamdan)
        const username = `user998${phoneDigits}`;

        const user = await AuthService.register(
          username,
          formData.password,
          formData.first_name,
          formData.last_name,
          generatedEmail,
          formData.region || undefined,
          formData.district || undefined
        );

        // Save credentials for auto-login
        localStorage.setItem('ecocash_credentials', JSON.stringify({
          email: user.email,
          password: formData.password
        }));

        onLogin(user);
        showToast('Hisob muvaffaqiyatli yaratildi!', 'success');
        setConfettiTrigger(true);
        setTimeout(() => navigate('/dashboard'), 500);
      } else {
        // Login with username or email
        const loginId = formData.username || formData.email;
        if (!loginId || !loginId.trim()) {
          setError('Username yoki Email kiriting');
          showToast('Username yoki Email kiriting', 'error');
          setLoading(false);
          return;
        }

        if (!formData.password || !formData.password.trim()) {
          setError('Parol kiriting');
          showToast('Parol kiriting', 'error');
          setLoading(false);
          return;
        }

        try {
          const user = await AuthService.login(loginId.trim(), formData.password);

          // Save credentials for auto-login
          localStorage.setItem('ecocash_credentials', JSON.stringify({
            email: user.email || loginId,
            password: formData.password
          }));

          onLogin(user);
          showToast('Muvaffaqiyatli kirdingiz!', 'success');
          setConfettiTrigger(true);
          setTimeout(() => navigate('/dashboard'), 500);
        } catch (loginError: any) {
          // Login xatoliklarini yaxshiroq ko'rsatish
          const errorMsg = loginError.message || 'Kirishda xatolik yuz berdi';
          setError(errorMsg);
          showToast(errorMsg, 'error');
          throw loginError;
        }
      }
    } catch (err: any) {
      // Xatolikni yaxshiroq ko'rsatish
      let errorMessage = err.message || (isRegister ? "Ro'yxatdan o'tishda xatolik" : "Kirishda xatolik");
      showToast(errorMessage, 'error');

      // Agar JSON xatolik bo'lsa, uni parse qilish
      try {
        if (err.message && err.message.includes('{')) {
          const errorObj = JSON.parse(err.message);
          if (errorObj.username) {
            errorMessage = `Username: ${errorObj.username[0] || errorObj.username}`;
          } else if (errorObj.error) {
            errorMessage = errorObj.error;
          } else if (typeof errorObj === 'string') {
            errorMessage = errorObj;
          }
        }
      } catch (e) {
        // JSON parse qilishda xatolik bo'lsa, oddiy xabarni ko'rsatish
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAutoLogin) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="w-8 h-8 border-2 border-eco-500/30 border-t-eco-500 rounded-full animate-spin mx-auto block mb-4"></span>
          <p className="text-slate-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-eco-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-2xl relative z-10 border-t border-white/20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 glass rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-eco-500/20">
             <Hexagon className="text-eco-400" fill="rgba(16, 185, 129, 0.1)" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            {isRegister ? 'Yangi Hisob Yaratish' : 'Kirish'}
          </h1>
          <p className="text-slate-400 text-sm mt-2">Secure Government Gateway</p>
        </div>

        {isRegister ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Ism"
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors"
                value={formData.first_name}
                onChange={e => setFormData({...formData, first_name: e.target.value})}
              />
            </div>

            <div className="relative group">
              <UserIcon className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Familya"
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors"
                value={formData.last_name}
                onChange={e => setFormData({...formData, last_name: e.target.value})}
              />
            </div>

            {/* Telefon raqam — +998 fixed prefix */}
            <div className="relative group">
              <Phone className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <div className="flex w-full bg-slate-950/50 border border-slate-700 rounded-xl focus-within:border-eco-500 transition-colors overflow-hidden">
                <span className="pl-12 pr-2 py-3.5 text-slate-400 text-sm font-mono whitespace-nowrap select-none">
                  +998
                </span>
                <input
                  type="tel"
                  placeholder="xx-xxx-xx-xx"
                  required
                  inputMode="numeric"
                  className="flex-1 bg-transparent pr-4 py-3.5 text-white focus:outline-none font-mono tracking-wider"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                />
              </div>
            </div>

            {/* Parol — ko'rish tugmasi bilan */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t.password}
                required
                minLength={6}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative group">
              <MapPin className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors z-10" size={20} />
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors appearance-none cursor-pointer"
                value={formData.region}
                onChange={e => setFormData({...formData, region: e.target.value, district: ''})}
              >
                <option value="" className="bg-slate-900 text-slate-400">Viloyat tanlang</option>
                {UZBEKISTAN_REGIONS.map(r => (
                  <option key={r.name} value={r.name} className="bg-slate-900 text-white">{r.name}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <MapPin className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors z-10" size={20} />
              <select
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                value={formData.district}
                disabled={!formData.region}
                onChange={e => setFormData({...formData, district: e.target.value})}
              >
                <option value="" className="bg-slate-900 text-slate-400">
                  {formData.region ? 'Tuman/Shahar tanlang' : 'Avval viloyat tanlang'}
                </option>
                {formData.region && UZBEKISTAN_REGIONS.find(r => r.name === formData.region)?.districts.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-white">{d}</option>
                ))}
              </select>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-eco-500 to-teal-600 hover:from-eco-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-eco-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Hisob Yaratish <ArrowRight size={20} />
                </>
              )}
            </button>

          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Username yoki Email"
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-12 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors"
                value={formData.username || formData.email || ''}
                onChange={e => {
                  const value = e.target.value.trim();
                  if (value.includes('@')) {
                    setFormData({...formData, email: value, username: ''});
                  } else {
                    setFormData({...formData, username: value, email: ''});
                  }
                  setError(''); // Clear error when user types
                }}
              />
            </div>

            {/* Parol — ko'rish tugmasi bilan */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-eco-400 transition-colors" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t.password}
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-eco-500 transition-colors"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-eco-500 to-teal-600 hover:from-eco-400 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-eco-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  Kirish <ArrowRight size={20} />
                </>
              )}
            </button>

          </form>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
              setShowPassword(false);
              setFormData({ username: '', email: '', password: '', first_name: '', last_name: '', phone: '', region: '', district: '' }); // Reset form when switching
            }}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            {isRegister ? 'Allaqachon hisobingiz bormi? Kirish' : 'Hisobingiz yo\'qmi? Ro\'yxatdan o\'tish'}
          </button>
        </div>
      </div>
    </div>
  );
};
