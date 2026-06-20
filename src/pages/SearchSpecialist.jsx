import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockDoctors } from '../data/mockData';

export default function SearchSpecialist() {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState('All');
  const [city, setCity] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [filtered, setFiltered] = useState(mockDoctors);
  const [connecting, setConnecting] = useState(null);

  const applyFilters = () => {
    let result = mockDoctors;
    if (specialty !== 'All') result = result.filter(d => d.specialty === specialty);
    if (city) result = result.filter(d => d.city.toLowerCase().includes(city.toLowerCase()));
    if (availableOnly) result = result.filter(d => d.is_available);
    setFiltered(result);
  };

  const handleConnect = (doctorId) => {
    setConnecting(doctorId);
    setTimeout(() => {
      setConnecting(null);
      navigate('/consultation-chat/c-001');
    }, 1500);
  };

  const getInitials = (name) => name.split(' ').filter(w => !w.startsWith('Dr')).map(w => w[0]).join('').slice(0, 2);

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Find Specialists</h1>
          <p className="text-[#3e4850] text-sm mt-1">Recommended specialists based on your risk assessment</p>
        </div>

        {/* Map placeholder */}
        <div className="bg-gradient-to-br from-[#bae6fd]/40 to-[#0ea5e9]/20 rounded-2xl h-48 mb-6 flex items-center justify-center border border-[#bae6fd] relative overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 gap-px opacity-20">
            {Array.from({ length: 72 }).map((_, i) => <div key={i} className="border border-[#006591]/30" />)}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {[
              { top: '20%', left: '25%' }, { top: '40%', left: '55%' }, { top: '15%', left: '65%' },
              { top: '60%', left: '40%' }, { top: '35%', left: '80%' }
            ].map((pos, i) => (
              <div key={i} className="absolute" style={{ top: pos.top, left: pos.left }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${i === 0 ? 'bg-[#006591] scale-125' : 'bg-[#0ea5e9]'}`}>
                  <span className="material-symbols-outlined text-white text-sm">add</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-[#f0f4fa]">
              <span className="material-symbols-outlined text-[#3e4850] text-xl">add</span>
            </button>
            <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-[#f0f4fa]">
              <span className="material-symbols-outlined text-[#3e4850] text-xl">remove</span>
            </button>
            <button className="w-9 h-9 bg-white rounded-lg shadow flex items-center justify-center hover:bg-[#f0f4fa]">
              <span className="material-symbols-outlined text-[#3e4850] text-xl">my_location</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-[#3e4850] mb-1.5 uppercase">Specialty</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4850] text-lg">psychology</span>
                <select
                  value={specialty}
                  onChange={e => setSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl text-sm text-[#171c20] focus:outline-none focus:border-[#006591] appearance-none"
                >
                  <option value="All">All Specialties</option>
                  <option>Breast Oncologist</option>
                  <option>Radiologist</option>
                  <option>Genetic Counselor</option>
                </select>
              </div>
            </div>

            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-[#3e4850] mb-1.5 uppercase">Location</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4850] text-lg">location_on</span>
                <select className="w-full pl-10 pr-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl text-sm text-[#171c20] focus:outline-none focus:border-[#006591] appearance-none">
                  <option>Within 10 Miles</option>
                  <option>Within 25 Miles</option>
                  <option>Within 50 Miles</option>
                </select>
              </div>
            </div>

            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-[#3e4850] mb-1.5 uppercase">Availability</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#3e4850] text-lg">calendar_today</span>
                <select className="w-full pl-10 pr-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl text-sm text-[#171c20] focus:outline-none focus:border-[#006591] appearance-none">
                  <option>This Week</option>
                  <option>Today</option>
                  <option>Next Week</option>
                </select>
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="bg-[#006591] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">search</span>
              Find
            </button>
          </div>
        </div>

        {/* Recommended banner */}
        <div className="bg-[#bae6fd] rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-[#006591]">auto_awesome</span>
          <p className="text-sm text-[#3d687c] font-medium">
            Based on your <strong>Moderate</strong> risk assessment, we recommend a <strong>Breast Oncologist</strong>
          </p>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Available Specialists</h2>
            <p className="text-sm text-[#3e4850]">Found {filtered.length} specialists matching your criteria.</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 bg-white border border-[#bec8d2]/40 rounded-lg flex items-center justify-center hover:bg-[#f0f4fa]">
              <span className="material-symbols-outlined text-[#3e4850] text-lg">grid_view</span>
            </button>
            <button className="w-9 h-9 bg-white border border-[#bec8d2]/40 rounded-lg flex items-center justify-center hover:bg-[#f0f4fa]">
              <span className="material-symbols-outlined text-[#3e4850] text-lg">list</span>
            </button>
          </div>
        </div>

        {/* Doctor cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doctor, idx) => (
            <div key={doctor.doctor_id} className={`bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative ${idx === 0 ? 'border-[#006591]/40' : 'border-[#bae6fd]'}`}>
              {idx === 0 && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  TOP MATCH
                </div>
              )}
              <div className="flex items-start gap-3 mt-4">
                <div className="w-14 h-14 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-lg flex-shrink-0">
                  {getInitials(doctor.full_name)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#171c20] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>{doctor.full_name}</h3>
                      <p className="text-xs text-[#3e4850]">{doctor.specialty.includes('Oncologist') ? 'Senior ' : ''}{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-[#de8712] text-sm">star</span>
                        <span className="text-xs font-medium">4.{idx + 7} ({(idx + 1) * 41 + 83} Reviews)</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      doctor.is_available ? 'bg-green-100 text-green-700' : 'bg-[#f0f4fa] text-[#3e4850]'
                    }`}>
                      {doctor.is_available ? 'Available Today' : 'Next Avail: Tomorrow'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-[#3e4850]">
                  <span className="material-symbols-outlined text-sm">local_hospital</span>
                  {doctor.hospital_name}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#3e4850]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {doctor.city} · {(idx * 2.4 + 2.4).toFixed(1)} miles away
                  {!doctor.is_available && idx === 2 && (
                    <span className="bg-[#f0f4fa] text-[#3e4850] text-xs px-2 py-0.5 rounded-full ml-auto">TELEHEALTH ONLY</span>
                  )}
                </div>
                <p className="text-xs text-[#3e4850]/70 leading-relaxed">{doctor.bio}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <button className="flex-1 border border-[#006591] text-[#006591] font-semibold py-2 rounded-xl text-xs hover:bg-[#006591]/10 transition-colors">
                  View Profile
                </button>
                <button
                  onClick={() => handleConnect(doctor.doctor_id)}
                  disabled={connecting === doctor.doctor_id}
                  className="flex-1 bg-[#006591] text-white font-bold py-2 rounded-xl text-xs hover:bg-[#005070] transition-colors disabled:opacity-70 flex items-center justify-center gap-1"
                >
                  {connecting === doctor.doctor_id ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Connecting...
                    </>
                  ) : 'Consult Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
