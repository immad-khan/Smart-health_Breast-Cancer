import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopBar({ onMenuToggle }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#f6faff] border-b border-[#bec8d2]/30 shadow-sm flex items-center justify-between px-4 py-3 md:px-6">
      {/* Mobile: logo + hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg hover:bg-[#eaeef4] transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-[#3e4850]">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#006591] rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">health_and_safety</span>
          </div>
          <span className="text-[#006591] font-bold text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health AI</span>
        </div>
      </div>

      {/* Desktop: search bar */}
      <div className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4850] text-lg">search</span>
          <input
            type="text"
            placeholder="Search records, symptoms..."
            className="w-full pl-10 pr-4 py-2 bg-[#f0f4fa] border border-[#bec8d2]/40 rounded-full text-sm text-[#171c20] placeholder-[#3e4850]/60 focus:outline-none focus:border-[#006591] transition-colors"
          />
        </div>
      </div>

      {/* Right side: notification + account */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowNotif(!showNotif)}
          className="relative p-2 rounded-full hover:bg-[#eaeef4] transition-colors"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[#3e4850]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white" />
        </button>
        <Link to="/settings">
          <div className="w-9 h-9 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-sm cursor-pointer hover:bg-[#0ea5e9]/30 transition-colors">
            {user ? user.full_name.split(' ').map(n => n[0]).join('').slice(0,2) : 'JD'}
          </div>
        </Link>
      </div>
    </header>
  );
}
