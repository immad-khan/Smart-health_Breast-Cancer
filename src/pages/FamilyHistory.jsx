import { useState } from 'react';
import Layout from '../components/Layout';
import { mockFamilyHistory, DISEASE_OPTIONS, mockRiskAssessment } from '../data/mockData';

const formatRelation = (rel) => rel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

function TreeNode({ member, onClick }) {
  const hasCancer = member?.conditions?.some(c => ['Breast Cancer', 'Ovarian Cancer'].includes(c));
  const hasBRCA = member?.conditions?.some(c => c.includes('BRCA'));

  if (!member) {
    return (
      <div className="bg-white border-2 border-dashed border-[#bec8d2]/40 rounded-2xl p-3 text-center min-w-[120px] cursor-pointer hover:border-[#006591]/50 hover:shadow-sm transition-all">
        <span className="material-symbols-outlined text-[#bec8d2] text-2xl">add</span>
        <p className="text-xs text-[#bec8d2]">Add Member</p>
      </div>
    );
  }

  return (
    <div
      onClick={() => onClick(member)}
      className={`bg-white border-2 rounded-2xl p-3 text-center min-w-[130px] cursor-pointer hover:shadow-md transition-all ${
        hasCancer ? 'border-[#ba1a1a] bg-[#ffdad6]/10'
        : hasBRCA ? 'border-[#de8712]'
        : 'border-[#bec8d2]/40'
      }`}
    >
      <span className="material-symbols-outlined text-[#3e4850]/50 text-3xl">account_circle</span>
      <p className="text-xs text-[#3e4850] mt-1 mb-2 font-medium">{formatRelation(member.member_relation)}</p>
      <div className="flex flex-wrap justify-center gap-1">
        {member.conditions.map(c => (
          <span
            key={c}
            className={`text-xs px-1.5 py-0.5 rounded-full ${
              c.includes('Cancer') || c.includes('BRCA') ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#f0f4fa] text-[#3e4850]'
            }`}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FamilyHistory() {
  const [members, setMembers] = useState(mockFamilyHistory);
  const [selectedMember, setSelectedMember] = useState(null);
  const [recording, setRecording] = useState(false);
  const [modalConditions, setModalConditions] = useState([]);
  const [notes, setNotes] = useState('');
  const [modalError, setModalError] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const getByRelation = (rel) => members.find(m => m.member_relation === rel);

  const openModal = (member) => {
    setSelectedMember(member);
    setModalConditions([...member.conditions]);
    setNotes(member.notes || '');
    setModalError('');
  };

  const closeModal = () => {
    setSelectedMember(null);
    setModalError('');
  };

  const toggleCondition = (cond) => {
    setModalConditions(prev =>
      prev.includes(cond) ? prev.filter(c => c !== cond) : [...prev, cond]
    );
  };

  const saveModal = () => {
    if (modalConditions.length === 0) {
      setModalError('Please select at least one condition.');
      return;
    }
    setMembers(prev => prev.map(m =>
      m.family_id === selectedMember.family_id
        ? { ...m, conditions: modalConditions, notes }
        : m
    ));
    closeModal();
  };

  const scorePercent = Math.round(mockRiskAssessment.generational_risk_score * 100);

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Family History</h1>
            <p className="text-[#3e4850] text-sm mt-1">Track hereditary conditions and generate clinical risk profiles.</p>
          </div>
          <button className="bg-[#006591] text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-[#005070] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Family Member
          </button>
        </div>

        {/* Voice input bar */}
        <div className="bg-[#bae6fd] rounded-2xl p-4 flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#006591]">mic</span>
            <p className="text-sm text-[#3d687c] font-medium">Use voice to quickly add family history</p>
          </div>
          <button
            onClick={() => setRecording(r => !r)}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-xl text-sm transition-colors ${
              recording ? 'bg-[#ba1a1a] text-white' : 'bg-[#006591] text-white hover:bg-[#005070]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">{recording ? 'stop' : 'mic'}</span>
            {recording ? 'Recording... Stop' : 'Start Voice Input'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Tree + existing list */}
          <div className="lg:col-span-2">
            {/* Family Tree Visual */}
            <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-6 shadow-sm overflow-x-auto mb-6">
              <div className="min-w-[600px]">
                {/* Grandparents row */}
                <div className="flex justify-center gap-4 mb-2">
                  <TreeNode member={getByRelation('paternal_grandfather')} onClick={openModal} />
                  <TreeNode member={null} onClick={() => {}} />
                  <TreeNode member={getByRelation('maternal_grandfather')} onClick={openModal} />
                  <TreeNode member={getByRelation('maternal_grandmother')} onClick={openModal} />
                </div>

                {/* Connecting lines */}
                <div className="flex justify-center gap-4 mb-2">
                  <div className="flex-1 flex justify-center">
                    <div className="w-px h-6 bg-[#bec8d2]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-px h-6 bg-transparent" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-px h-6 bg-[#bec8d2]" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-px h-6 bg-[#bec8d2]" />
                  </div>
                </div>

                {/* Parents row */}
                <div className="flex justify-center gap-16 mb-2">
                  <TreeNode member={getByRelation('father')} onClick={openModal} />
                  <TreeNode member={getByRelation('mother')} onClick={openModal} />
                </div>

                {/* Connecting line to patient */}
                <div className="flex justify-center mb-2">
                  <div className="w-px h-6 bg-[#bec8d2]" />
                </div>

                {/* Patient + sibling row */}
                <div className="flex justify-center gap-6">
                  <TreeNode member={getByRelation('sibling')} onClick={openModal} />
                  {/* Patient node */}
                  <div className="bg-[#bae6fd]/20 border-2 border-[#006591] rounded-2xl p-3 text-center min-w-[140px] shadow-md">
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#006591] text-white text-xs px-2 py-0.5 rounded-full" style={{ position: 'relative' }}>
                      <span className="text-xs bg-[#006591] text-white px-2 py-0.5 rounded-full">PATIENT PROFILE</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#006591] flex items-center justify-center text-white font-bold text-lg mx-auto mt-1 mb-1">JD</div>
                    <p className="font-bold text-[#171c20] text-sm">Jane Doe</p>
                    <p className="text-xs text-[#3e4850]">Female, 34 yrs</p>
                    <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full mt-1 inline-flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">warning</span>
                      Moderate Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk impact notice */}
            <div className="bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 rounded-xl p-3 flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#006591] text-lg">info</span>
              <p className="text-sm text-[#3e4850]">Saving family history will automatically update your risk assessment.</p>
            </div>

            {/* Existing history list - collapsible */}
            <div className="bg-white border border-[#bec8d2]/30 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#f0f4fa] transition-colors"
              >
                <h3 className="font-bold text-[#171c20] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Family History Records</h3>
                <span className="material-symbols-outlined text-[#3e4850] transition-transform" style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0)' }}>expand_less</span>
              </button>
              {!collapsed && (
                <div className="border-t border-[#bec8d2]/20">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f0f4fa]">
                      <tr>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#3e4850] uppercase">Relation</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#3e4850] uppercase">Conditions</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#3e4850] uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#bec8d2]/20">
                      {members.map(m => (
                        <tr key={m.family_id} className="hover:bg-[#f0f4fa]/50 cursor-pointer" onClick={() => openModal(m)}>
                          <td className="px-4 py-3 text-[#171c20] font-medium">{formatRelation(m.member_relation)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {m.conditions.map(c => (
                                <span key={c} className={`text-xs px-2 py-0.5 rounded-full ${c.includes('Cancer') || c.includes('BRCA') ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#f0f4fa] text-[#3e4850]'}`}>{c}</span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#3e4850]">{m.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right: Risk Panel */}
          <div className="space-y-4">
            {/* AI Risk Assessment */}
            <div className="bg-white border border-[#bae6fd] rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#006591] text-lg">auto_awesome</span>
                <p className="font-bold text-[#171c20] text-sm">AI Risk Assessment</p>
              </div>
              <p className="text-xs text-[#3e4850]">Based on 3 generations of clinical data, genetic predispositions have been mapped.</p>
            </div>

            {/* Hereditary Risk Profile */}
            <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-[#171c20] mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>Hereditary Risk Profile</h3>

              {/* Score circle */}
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <div
                    className="w-32 h-32 rounded-full"
                    style={{ background: `conic-gradient(#de8712 ${scorePercent}%, #dee3e9 0)` }}
                  >
                    <div className="absolute inset-3 bg-white rounded-full flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-[#de8712]" style={{ fontFamily: 'Manrope, sans-serif' }}>{scorePercent}</span>
                      <span className="text-xs text-[#3e4850]">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Elevated Risk</p>
                <p className="text-xs text-[#3e4850]">Regular screening recommended.</p>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-[#3e4850] uppercase tracking-wide mb-3">Disease Frequency in Lineage</p>
                <div className="space-y-3">
                  {[
                    { label: 'Breast/Ovarian', percent: 60, color: '#ba1a1a' },
                    { label: 'BRCA Mutation', percent: 40, color: '#de8712' },
                    { label: 'Hypertension', percent: 30, color: '#0ea5e9' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#3e4850] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                          {item.label}
                        </span>
                        <span className="text-[#171c20] font-medium">{item.percent}%</span>
                      </div>
                      <div className="w-full bg-[#f0f4fa] rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full border border-[#006591] text-[#006591] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#006591]/10 transition-colors">
                View Detailed Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#171c20] mb-1" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Edit {formatRelation(selectedMember.member_relation)}
            </h2>
            <p className="text-xs text-[#3e4850] mb-4">Update medical conditions for this family member</p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#171c20] mb-2">Relation</label>
              <input
                type="text"
                value={formatRelation(selectedMember.member_relation)}
                readOnly
                className="w-full px-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl text-sm text-[#3e4850]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#171c20] mb-2">Medical Conditions</label>
              {modalError && (
                <p className="text-[#ba1a1a] text-xs mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {modalError}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {DISEASE_OPTIONS.map(opt => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors ${
                      modalConditions.includes(opt) ? 'bg-[#bae6fd]/40 border border-[#bae6fd]' : 'hover:bg-[#f0f4fa]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={modalConditions.includes(opt)}
                      onChange={() => toggleCondition(opt)}
                      className="accent-[#006591] w-3.5 h-3.5"
                    />
                    <span className="text-xs text-[#171c20]">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-[#171c20] mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl text-sm focus:outline-none focus:border-[#006591] resize-none"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-[#006591] text-[#006591] font-bold py-2.5 rounded-xl text-sm hover:bg-[#006591]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                className="flex-1 bg-[#006591] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#005070] transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
