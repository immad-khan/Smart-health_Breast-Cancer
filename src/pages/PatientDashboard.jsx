import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const riskColor = {
  Low: 'bg-green-100 text-green-700',
  Moderate: 'bg-[#ffdcbd] text-[#8a5100]',
  High: 'bg-[#ffdad6] text-[#ba1a1a]',
};

const riskIcon = {
  Low: 'check_circle',
  Moderate: 'warning',
  High: 'dangerous',
};

const quickActions = [
  { label: 'Input Symptoms', to: '/symptom-input', icon: 'psychology', bg: 'bg-[#bae6fd]' },
  { label: 'Upload Images', to: '/image-upload', icon: 'radiology', bg: 'bg-[#0ea5e9]/10' },
  { label: 'Upload Documents', to: '/document-upload', icon: 'upload_file', bg: 'bg-[#ffdcbd]/40' },
  { label: 'View Risk', to: '/risk-assessment', icon: 'analytics', bg: 'bg-[#ffdad6]/40' },
  { label: 'Find Specialists', to: '/search-specialist', icon: 'person_search', bg: 'bg-[#006591]/10' },
  { label: 'My EHR', to: '/ehr', icon: 'folder_shared', bg: 'bg-[#bae6fd]/60' },
  { label: 'Family History', to: '/family-history', icon: 'family_history', bg: 'bg-[#eaeef4]' },
  { label: 'Start Chat', to: '/consultation-chat/c-001', icon: 'chat', bg: 'bg-[#bee9ff]/50' },
];

const recentActivity = [
  { icon: 'radiology', text: 'Mammogram uploaded and analyzed', date: 'Mar 11, 2024', color: 'text-[#006591]' },
  { icon: 'analytics', text: 'Risk assessment generated — Moderate', date: 'Mar 14, 2024', color: 'text-[#de8712]' },
  { icon: 'chat', text: 'Consultation with Dr. Sarah Ahmed', date: 'Mar 14, 2024', color: 'text-[#396477]' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Good day, {user?.full_name?.split(' ')[0] || 'Patient'}
          </h1>
          <p className="text-[#3e4850] text-sm mt-1">Here is your AI-curated health overview for today, {today}.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#bec8d2]/30 shadow-sm">
            <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-2">Overall Risk</p>
            <div className={`inline-flex items-center gap-1.5 text-lg font-bold ${riskColor['Low']} px-2 py-0.5 rounded-lg`} style={{ fontFamily: 'Manrope, sans-serif' }}>
              <span className="material-symbols-outlined text-lg">{riskIcon['Low']}</span>
              Low
            </div>
            <p className="flex items-center gap-1 text-xs text-[#3e4850] mt-2">
              <span className="material-symbols-outlined text-sm">health_and_safety</span>
              All normal
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#bec8d2]/30 shadow-sm">
            <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-2">New Reports</p>
            <p className="text-4xl font-bold text-[#006591]" style={{ fontFamily: 'Manrope, sans-serif' }}>0</p>
            <p className="flex items-center gap-1 text-xs text-[#3e4850] mt-2">
              <span className="material-symbols-outlined text-sm">info</span>
              No new reports
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#bec8d2]/30 shadow-sm">
            <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-2">Consultations</p>
            <p className="text-4xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>0</p>
            <p className="flex items-center gap-1 text-xs text-[#3e4850] mt-2">
              <span className="material-symbols-outlined text-sm">event</span>
              No upcoming appointments
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#bec8d2]/30 shadow-sm">
            <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-2">Family Records</p>
            <p className="text-4xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>0</p>
            <p className="flex items-center gap-1 text-xs text-[#3e4850] mt-2">
              <span className="material-symbols-outlined text-sm">schedule</span>
              No records added
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.slice(0,4).map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="bg-white border border-[#bec8d2]/30 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <span className="material-symbols-outlined text-[#006591] text-xl">{action.icon}</span>
                  </div>
                  <span className="text-xs font-medium text-[#3e4850] text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Recent Health Activity</h2>
              <Link to="/ehr" className="text-[#006591] text-sm font-semibold hover:underline">View All</Link>
            </div>
              <div className="p-8 text-center text-[#3e4850] bg-white rounded-2xl border border-[#bec8d2]/30 shadow-sm">
                <span className="material-symbols-outlined text-4xl mb-2 text-[#bec8d2]">history</span>
                <p>No recent activity yet.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Removed mock active consultation banner */}

        {/* AI Health Insight */}
        <div className="bg-white rounded-2xl border border-[#bec8d2]/30 shadow-sm p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-[#bae6fd] rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-[#006591] text-xl">auto_awesome</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#171c20] text-sm mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>AI Health Insight</h3>
            <p className="text-[#3e4850] text-sm">Based on your recent wearable data and family history, we suggest scheduling a routine cardiovascular screening within the next 3 months.</p>
          </div>
          <Link to="/search-specialist" className="bg-[#006591] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#005070] transition-colors flex-shrink-0">
            Schedule Now
          </Link>
        </div>
      </div>
    </Layout>
  );
}
