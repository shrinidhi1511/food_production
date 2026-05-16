import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/sensors',
    label: 'Sensors',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 12 Q6 4 10 12 Q14 20 18 12 Q22 4 26 12" />
        <path d="M2 12 C6 4, 10 20, 14 12 S22 4, 26 12" />
        <polyline points="22 12 22 12" />
        <path d="M3 12 C5 6 9 18 12 12 C15 6 19 18 21 12" />
      </svg>
    ),
  },
  {
    to: '/analysis',
    label: 'Analysis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    to: '/recipes',
    label: 'Recipes',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { totalAlerts, simulating } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white shadow-xl flex flex-col z-40 border-r border-slate-100">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-200">
            <span className="text-white text-lg">🍽️</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-800 leading-tight">Digital Twin</h1>
            <p className="text-[11px] font-medium text-purple-600 tracking-wide uppercase">Food Quality System</p>
          </div>
        </div>

        {/* Live indicator */}
        {simulating && (
          <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-700">Live Simulation</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md shadow-purple-200'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600 transition-colors'}>
                  {icon}
                </span>
                <span>{label}</span>
                {label === 'Sensors' && totalAlerts > 0 && (
                  <span className="ml-auto badge-pulse bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalAlerts}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Stats strip */}
      <div className="mx-4 mb-4 bg-purple-50 rounded-xl p-3">
        <p className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest mb-2">System Status</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Batches', value: '6', color: 'text-purple-700' },
            { label: 'Alerts', value: totalAlerts, color: totalAlerts > 0 ? 'text-red-600' : 'text-green-600' },
            { label: 'Recipes', value: '6', color: 'text-blue-600' },
            { label: 'Model', value: 'RF+LR', color: 'text-orange-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-lg p-2 text-center">
              <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="px-4 pb-5 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">shri1511</p>
            <p className="text-xs text-slate-400 truncate">shri@foodtwin.ai</p>
          </div>
          <button
            onClick={() => {}}
            title="Logout"
            className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
        <button
          onClick={() => {}}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-500 text-xs font-medium hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
