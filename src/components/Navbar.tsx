import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  Image as ImageIcon,
  Award,
  ShieldCheck,
  Mail,
  Home,
  Info,
  Menu,
  X,
  Lock,
  Sun,
  Moon,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  onOpenAdminModal: () => void;
  onLogoutAdmin: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onRegisterClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isAdmin,
  onOpenAdminModal,
  onLogoutAdmin,
  darkMode,
  setDarkMode,
  onRegisterClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'verify', label: 'Certificate Verify', icon: ShieldCheck },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
            id="navbar-brand-logo"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-600 via-orange-500 to-amber-400 p-[2px] shadow-lg shadow-orange-600/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-wider text-white font-mono uppercase">
                  APEX<span className="text-orange-500 font-extrabold">.</span>
                </span>
                <span className="bg-gradient-to-r from-red-500 to-orange-500 text-[10px] font-bold px-1.5 py-0.5 rounded text-white tracking-widest uppercase">
                  KULGAM
                </span>
              </div>
              <p className="text-[11px] font-medium text-zinc-400 tracking-widest uppercase -mt-1">
                Athletics & Marathon
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-btn-${item.id}`}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md shadow-orange-600/20'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
              id="theme-toggle-desktop"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-400" />}
            </button>

            {/* Admin Portal Button */}
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  id="admin-dashboard-btn"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    activeTab === 'admin'
                      ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-orange-500/50'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onLogoutAdmin}
                  id="admin-logout-btn"
                  className="text-xs text-zinc-400 hover:text-red-400 underline px-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminModal}
                id="admin-login-nav-btn"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all"
                title="Admin Login"
              >
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Admin</span>
              </button>
            )}

            {/* CTA Register Now */}
            <button
              onClick={onRegisterClick}
              id="header-register-now-btn"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-600/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Register Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              id="theme-toggle-mobile"
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-orange-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle-btn"
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                id={`mobile-nav-btn-${item.id}`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onRegisterClick();
                setMobileMenuOpen(false);
              }}
              id="mobile-register-btn"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-base font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg shadow-orange-600/30"
            >
              <span>Register Now for Marathon</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            {isAdmin ? (
              <button
                onClick={() => handleNavClick('admin')}
                id="mobile-admin-btn"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30"
              >
                <Lock className="w-4 h-4" />
                <span>Go to Admin Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminModal();
                  setMobileMenuOpen(false);
                }}
                id="mobile-admin-login-btn"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium bg-zinc-900 text-zinc-300 border border-zinc-800"
              >
                <Lock className="w-4 h-4 text-zinc-400" />
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
