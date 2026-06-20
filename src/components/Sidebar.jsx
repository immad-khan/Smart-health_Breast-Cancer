import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/MockAuthContext';

const patientNavLinks = [
  { to: '/patient-dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/ehr', icon: 'description', label: 'Health Records' },
  { to: '/symptom-input', icon: 'psychology', label: 'Symptom AI' },
  { to: '/image-upload', icon: 'radiology', label: 'Radiology Lab' },
  { to: '/family-history', icon: 'family_history', label: 'Family Tree' },
  { to: '/consultation-chat/c-001', icon: 'forum', label: 'Consultations' },
];

const doctorNavLinks = [
  { to: '/doctor-dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/ehr', icon: 'description', label: 'Health Records' },
  { to: '/symptom-input', icon: 'psychology', label: 'Symptom AI' },
  { to: '/image-upload', icon: 'radiology', label: 'Radiology Lab' },
  { to: '/family-history', icon: 'family_history', label: 'Family Tree' },
  { to: '/consultation-chat/c-001', icon: 'forum', label: 'Consultations' },
];

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const navLinks = role === 'doctor' ? doctorNavLinks : patientNavLinks;

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-w-[220px] h-screen bg-[#f6faff] border-r border-[#bec8d2]/40 py-4 px-3 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 pb-6 pt-2">
        <div className="w-9 h-9 bg-[#006591] rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-xl">health_and_safety</span>
        </div>
        <div>
          <p className="text-[#006591] font-bold text-sm leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health AI</p>
          <p className="text-[#3e4850] text-xs">Clinical Precision</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col gap-1 flex-1">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-[#bae6fd] text-[#3d687c] font-bold'
                  : 'text-[#3e4850] hover:bg-[#e4e8ee]'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}

        <div className="mt-auto pt-4 border-t border-[#bec8d2]/40 flex flex-col gap-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                isActive ? 'bg-[#bae6fd] text-[#3d687c] font-bold' : 'text-[#3e4850] hover:bg-[#e4e8ee]'
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            <span>Settings</span>
          </NavLink>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-[#3e4850] hover:bg-[#e4e8ee]"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            <span>Support</span>
          </a>
        </div>

        {/* New Analysis Button */}
        <button
          onClick={() => navigate('/symptom-input')}
          className="mt-3 flex items-center justify-center gap-2 w-full bg-[#006591] hover:bg-[#005070] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm text-sm"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Analysis
        </button>

        {/* User info at bottom */}
        {user && (
          <div className="mt-3 flex items-center gap-2 px-2 py-2 rounded-xl bg-[#eaeef4]">
            <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-sm">
              {user.full_name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#171c20] truncate">{user.full_name}</p>
              <p className="text-xs text-[#3e4850] truncate">{role === 'doctor' ? 'Doctor' : `Patient ID: #8824`}</p>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
