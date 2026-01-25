import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hexagon, LogOut, ChevronDown, Menu, X, Sun, Moon, ShieldCheck } from 'lucide-react';
import { Language, User } from '../types';
import { TRANSLATIONS } from '../constants';
import { AuthService } from '../services/authService';

interface NavbarProps {
  lang: Language;
  setLang: (l: Language) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  lang, setLang, user, setUser, isDark, toggleTheme 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang].nav;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Trigger logo animation on route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 1000); // 1s matches CSS animation duration
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path ? "text-eco-500 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:scale-105 transition-all";

  // Instant Navigation
  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    handleNavClick('/');
  };

  const toggleLang = (l: Language) => {
    setLang(l);
    setLangMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div onClick={() => handleNavClick('/')} className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-eco-500 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
              <Hexagon 
                className={`text-eco-500 fill-eco-500/10 relative z-10 transition-transform duration-500 ${isNavigating ? 'animate-spin-once' : 'group-hover:rotate-90'}`} 
                strokeWidth={2} 
                size={32} 
              />
            </div>
            <span className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
              Eco<span className="text-eco-500">Cash</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => handleNavClick('/')} className={`${isActive('/')} text-sm tracking-wide`}>{t.home}</button>
            <button onClick={() => handleNavClick('/security')} className={`${isActive('/security')} text-sm tracking-wide flex items-center gap-1`}>
              {location.pathname === '/security' && <ShieldCheck size={14} />}
              {t.security}
            </button>
            {user && (
              <>
                <button onClick={() => handleNavClick('/dashboard')} className={`${isActive('/dashboard')} text-sm tracking-wide`}>{t.dashboard}</button>
                <button onClick={() => handleNavClick('/scanner')} className={`${isActive('/scanner')} text-sm tracking-wide`}>{t.scanner}</button>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors hover:rotate-12"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors tracking-widest"
              >
                {lang} <ChevronDown size={12} />
              </button>
              
              {langMenuOpen && (
                <div className="absolute top-8 right-0 w-24 glass-card rounded-xl overflow-hidden py-1 shadow-2xl animate-[fadeIn_0.2s]">
                  {Object.values(Language).map((l) => (
                    <button
                      key={l}
                      onClick={() => toggleLang(l)}
                      className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-eco-500/10 transition-colors ${lang === l ? 'text-eco-500' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-slate-200 dark:border-white/10">
                <span className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</span>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleNavClick('/login')} 
                className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 border border-transparent dark:border-white/10 text-white text-sm font-medium transition-all hover:scale-105 shadow-lg shadow-eco-500/10"
              >
                {t.login}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-900 dark:text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 backdrop-blur-2xl border-t border-slate-200 dark:border-white/20 absolute w-full left-0 px-4 py-6 space-y-4 shadow-2xl h-screen animate-page-enter">
          <button onClick={() => handleNavClick('/')} className="block w-full text-left text-xl font-bold text-slate-900 dark:text-white hover:text-eco-500 py-3 border-b border-slate-200 dark:border-white/10 transition-colors">{t.home}</button>
          <button onClick={() => handleNavClick('/security')} className="block w-full text-left text-xl font-bold text-slate-900 dark:text-white hover:text-eco-500 py-3 border-b border-slate-200 dark:border-white/10 transition-colors">{t.security}</button>
          {user && (
            <>
              <button onClick={() => handleNavClick('/dashboard')} className="block w-full text-left text-xl font-bold text-slate-900 dark:text-white hover:text-eco-500 py-3 border-b border-slate-200 dark:border-white/10 transition-colors">{t.dashboard}</button>
              <button onClick={() => handleNavClick('/scanner')} className="block w-full text-left text-xl font-bold text-slate-900 dark:text-white hover:text-eco-500 py-3 border-b border-slate-200 dark:border-white/10 transition-colors">{t.scanner}</button>
            </>
          )}
          
          <div className="pt-6 flex items-center justify-between border-t border-slate-200 dark:border-white/10 mt-4">
            <div className="flex gap-4">
              <button onClick={() => {toggleTheme(); }} className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                 {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button onClick={() => {toggleLang(lang === Language.UZ ? Language.EN : Language.UZ);}} className="p-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 font-bold uppercase hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                 {lang}
              </button>
            </div>
            
            {!user ? (
              <button onClick={() => handleNavClick('/login')} className="px-8 py-3 rounded-xl bg-eco-500 hover:bg-eco-600 text-white font-bold shadow-lg shadow-eco-500/30 transition-all">{t.login}</button>
            ) : (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="px-8 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold border border-red-500/20 transition-colors">Log out</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};