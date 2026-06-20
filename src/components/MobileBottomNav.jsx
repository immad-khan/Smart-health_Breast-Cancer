import { NavLink } from 'react-router-dom';

const mobileNavItems = [
  { to: '/patient-dashboard', icon: 'dashboard', label: 'Home' },
  { to: '/symptom-input', icon: 'psychology', label: 'Symptoms' },
  { to: '/image-upload', icon: 'radiology', label: 'Radiology' },
  { to: '/consultation-chat/c-001', icon: 'forum', label: 'Chat' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
];

export default function MobileBottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#f6faff] border-t border-[#bec8d2]/40 flex justify-around items-center py-2 z-50 shadow-lg">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              isActive ? 'text-[#006591]' : 'text-[#3e4850]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-[#006591] mt-0.5" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
