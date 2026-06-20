import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockDoctorUser, mockPendingConsultations, mockConsultations } from '../data/mockData';

const riskColors = {
  High: 'bg-[#ffdad6] text-[#ba1a1a]',
  Moderate: 'bg-[#ffdcbd] text-[#8a5100]',
  Low: 'bg-green-100 text-green-700',
};

const riskIcons = {
  High: 'dangerous',
  Moderate: 'warning',
  Low: 'check_circle',
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
};

const pendingList = [
  { id: 'p1', initials: 'EJ', name: 'Elena Jenkins', pid: '#84920', symptoms: ['Chest Pain', 'Shortness of breath'], risk: 'High' },
  { id: 'p2', initials: 'MR', name: 'Marcus Reyes', pid: '#84921', symptoms: ['Persistent Cough', 'Fatigue'], risk: 'Moderate' },
  { id: 'p3', initials: 'SL', name: 'Sarah Lin', pid: '#84922', symptoms: ['Routine Checkup', 'Refill Req'], risk: 'Low' },
];

const schedule = [
  { time: '09:00 AM', name: 'David Chen', type: 'Follow-up: Hypertension', icon: 'videocam', dot: true },
  { time: '10:30 AM', name: 'Amelia Pond', type: 'Initial Consultation', icon: 'person', dot: false },
  { time: '01:00 PM', name: 'Lab Review Block', type: 'AI Radiology Analysis', icon: 'biotech', dot: false },
];

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(mockDoctorUser.is_available);
  const [connecting, setConnecting] = useState(null);
  const [declined, setDeclined] = useState([]);
  const [closedOpen, setClosedOpen] = useState(false);

  const handleAccept = (id) => {
    setConnecting(id);
    setTimeout(() => { setConnecting(null); navigate('/consultation-chat/c-001'); }, 1500);
  };

  const handleDecline = (id) => {
    setDeclined(prev => [...prev, id]);
  };

  const activeConsultations = mockConsultations.filter(c => c.status === 'active');
  const closedConsultations = mockConsultations.filter(c => c.status === 'closed');

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Good morning, {mockDoctorUser.full_name}
            </h1>
            <p className="text-[#3e4850] text-sm mt-1">Here is your clinical overview for today, {today}.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#bec8d2]/30 rounded-xl px-4 py-2 shadow-sm">
            <span className="material-symbols-outlined text-green-600 text-lg">verified_user</span>
            <span className="text-sm font-medium text-[#171c20]">System Status: Optimal</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-[#bae6fd] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006591] text-xl">group</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">+4% this week</span>
            </div>
            <p className="text-4xl font-bold text-[#171c20] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>1,248</p>
            <p className="text-sm text-[#3e4850] mt-1">Total Active Patients</p>
          </div>

          <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-[#ffdad6] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ba1a1a] text-xl">assignment_late</span>
              </div>
              <span className="bg-[#ffdad6] text-[#93000a] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                Action Required
              </span>
            </div>
            <p className="text-4xl font-bold text-[#171c20] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>
              {mockPendingConsultations.length + pendingList.length}
            </p>
            <p className="text-sm text-[#3e4850] mt-1">Pending Consultation Requests</p>
          </div>

          <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 bg-[#bae6fd] rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006591] text-xl">calendar_today</span>
              </div>
              <span className="text-xs text-[#3e4850] bg-[#f0f4fa] px-2 py-0.5 rounded-full">Today</span>
            </div>
            <p className="text-4xl font-bold text-[#171c20] mt-2" style={{ fontFamily: 'Manrope, sans-serif' }}>8</p>
            <p className="text-sm text-[#3e4850] mt-1">Scheduled Appointments</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* Pending requests */}
          <div className="lg:col-span-3 bg-white border border-[#bec8d2]/30 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#bec8d2]/20">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Pending Requests</h2>
                <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2 py-0.5 rounded-full">{pendingList.length}</span>
              </div>
              <button className="text-[#006591] text-sm font-medium hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="divide-y divide-[#bec8d2]/20">
              {pendingList.map(p => (
                <div key={p.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#f0f4fa] flex items-center justify-center text-[#3e4850] font-bold text-sm flex-shrink-0">
                    {p.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#171c20] text-sm">{p.name}</p>
                    <p className="text-xs text-[#3e4850]">ID: {p.pid}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.symptoms.map(s => (
                      <span key={s} className="bg-[#f0f4fa] text-[#3e4850] text-xs px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-xl flex-shrink-0 ${riskColors[p.risk]}`}>
                    <span className="material-symbols-outlined text-sm">{riskIcons[p.risk]}</span>
                    {p.risk} Risk
                  </span>
                  <button
                    onClick={() => navigate('/ehr')}
                    className="bg-white border border-[#bec8d2] text-[#3e4850] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#f0f4fa] transition-colors flex-shrink-0"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Today's schedule */}
          <div className="lg:col-span-2 bg-white border border-[#bec8d2]/30 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#bec8d2]/20">
              <h2 className="font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Today's Schedule</h2>
            </div>
            <div className="p-4 space-y-3">
              {schedule.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${item.dot ? 'bg-[#006591]' : 'bg-[#bec8d2]'}`} />
                    {i < schedule.length - 1 && <div className="w-px h-8 bg-[#bec8d2]/40 mt-1" />}
                  </div>
                  <div className="flex-1 bg-[#f0f4fa] rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#006591]">{item.time}</p>
                      <span className="material-symbols-outlined text-[#3e4850] text-lg">{item.icon}</span>
                    </div>
                    <p className="font-semibold text-[#171c20] text-sm">{item.name}</p>
                    <p className="text-xs text-[#3e4850]">{item.type}</p>
                  </div>
                </div>
              ))}
              <button className="w-full text-[#006591] text-sm font-medium hover:underline pt-2">
                Open Full Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Availability toggle */}
        <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 flex items-center justify-between shadow-sm mb-6">
          <div>
            <p className="font-bold text-[#171c20] text-sm">Your Status</p>
            <p className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-[#3e4850]'}`}>
              {isAvailable ? '● Available for consultations' : '○ Currently unavailable'}
            </p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Consultation requests from mock data */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health Pending Requests</h2>
            <span className="bg-[#ffdad6] text-[#93000a] text-xs font-bold px-2 py-0.5 rounded-full">{mockPendingConsultations.filter(c => !declined.includes(c.consultation_id)).length}</span>
          </div>
          <div className="space-y-4">
            {mockPendingConsultations.filter(c => !declined.includes(c.consultation_id)).map(req => (
              <div key={req.consultation_id} className="bg-white border border-[#bae6fd] rounded-2xl p-5 shadow-sm">
                <div className="flex flex-wrap items-start gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-[#171c20] text-sm">{req.patient_name}</p>
                      <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-xl ${riskColors[req.patient_risk_level]}`}>
                        <span className="material-symbols-outlined text-sm">{riskIcons[req.patient_risk_level]}</span>
                        {req.patient_risk_level}
                      </span>
                    </div>
                    <p className="text-xs text-[#3e4850] mt-0.5">{timeAgo(req.initiated_at)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {req.top_factors.map(f => (
                    <span key={f} className="bg-[#f0f4fa] text-[#3e4850] text-xs px-2.5 py-1 rounded-full">{f}</span>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDecline(req.consultation_id)}
                    className="border border-[#ba1a1a] text-[#ba1a1a] font-semibold px-5 py-2 rounded-xl text-sm hover:bg-[#ba1a1a]/10 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAccept(req.consultation_id)}
                    disabled={connecting === req.consultation_id}
                    className="bg-[#006591] text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#005070] transition-colors disabled:opacity-70 flex items-center gap-2"
                  >
                    {connecting === req.consultation_id ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                        Connecting...
                      </>
                    ) : 'Accept & Start Chat'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active consultations */}
        {activeConsultations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Active Consultations</h2>
            <div className="space-y-3">
              {activeConsultations.map(c => (
                <div key={c.consultation_id} className="bg-white border border-[#bae6fd] rounded-2xl p-5 flex flex-wrap items-center gap-4 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-[#171c20] text-sm">{c.patient_id === 'u-001' ? 'Jane Doe' : 'Patient'}</p>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Active</span>
                  </div>
                  <Link to={`/consultation-chat/${c.consultation_id}`} className="bg-[#006591] text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-[#005070] transition-colors">
                    Open Chat
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closed consultations */}
        <div>
          <button onClick={() => setClosedOpen(!closedOpen)} className="flex items-center gap-2 text-xl font-bold text-[#171c20] mb-4 hover:text-[#006591] transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
            <span className="material-symbols-outlined text-[#3e4850] transition-transform" style={{ transform: closedOpen ? 'rotate(90deg)' : '' }}>chevron_right</span>
            Closed Consultations History
            <span className="text-sm font-normal text-[#3e4850]">({closedConsultations.length})</span>
          </button>
          {closedOpen && (
            <div className="space-y-3">
              {closedConsultations.map(c => (
                <div key={c.consultation_id} className="bg-white border border-[#bec8d2]/30 rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-[#171c20] text-sm">{c.doctor_name}</p>
                    <p className="text-xs text-[#3e4850]">Closed: {c.closed_at ? new Date(c.closed_at).toLocaleString() : 'N/A'}</p>
                  </div>
                  <span className="bg-[#f0f4fa] text-[#3e4850] text-xs px-2 py-0.5 rounded-full">Closed</span>
                  <Link to="/ehr" className="text-[#006591] text-sm font-medium hover:underline">View Summary</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
