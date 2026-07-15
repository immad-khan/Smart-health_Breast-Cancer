import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileBottomNav from './MobileBottomNav';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6faff]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-[#f6faff] h-full shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#bec8d2]/40">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#006591] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">health_and_safety</span>
                </div>
                <span className="text-[#006591] font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health AI</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-[#eaeef4]"
              >
                <span className="material-symbols-outlined text-[#3e4850]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <nav className="flex flex-col gap-1">
                {[
                  { to: '/patient-dashboard', icon: 'dashboard', label: 'Dashboard' },
                  { to: '/ehr', icon: 'description', label: 'Health Records' },
                  { to: '/symptom-input', icon: 'psychology', label: 'Symptom AI' },
                  { to: '/image-upload', icon: 'radiology', label: 'Radiology Lab' },
                  { to: '/family-history', icon: 'family_history', label: 'Family Tree' },
                  { to: '/consultation-chat/c-001', icon: 'forum', label: 'Consultations' },
                  { to: '/settings', icon: 'settings', label: 'Settings' },
                ].map(link => (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-[#3e4850] hover:bg-[#e4e8ee]"
                  >
                    <span className="material-symbols-outlined text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </a>
                ))}
                
                <div className="my-2 border-t border-[#bec8d2]/40"></div>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-[#ba1a1a] hover:bg-[#ffdad6] text-left w-full"
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 md:ml-[220px] overflow-hidden">
        <TopBar onMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
