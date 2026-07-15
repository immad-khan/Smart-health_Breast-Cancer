import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { mockSymptoms, mockImages, mockDocuments, mockRiskAssessment, mockFamilyHistory, mockConsultations } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TABS = ['Symptoms', 'Images', 'Documents', 'Risk History', 'Family History', 'Consultations'];

const formatRelation = (rel) => rel.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export default function EHRView() {
  const { role, user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [localSymptoms, setLocalSymptoms] = useState([]);
  const [ocrDocs, setOcrDocs] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('userSymptoms') || '[]');
      setLocalSymptoms(saved);
    } catch(e) {}

    fetch('http://127.0.0.1:8002/ocr/documents')
      .then(r => r.json())
      .then(d => {
        if (d.documents) setOcrDocs(d.documents);
      })
      .catch(console.error);
  }, []);

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Electronic Health Record</h1>
            <p className="text-[#3e4850] text-sm mt-1">Complete medical history and AI analysis records</p>
          </div>
          <div className="flex items-center gap-2 bg-[#ffdad6] text-[#93000a] px-3 py-1.5 rounded-xl text-sm font-medium">
            <span className="material-symbols-outlined text-lg">warning</span>
            High Risk Profile
          </div>
        </div>

        {/* Patient info bar */}
        <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-xl">{user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}</div>
          <div>
            <h2 className="font-bold text-[#171c20] text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>{user?.full_name || 'Jane Doe'}</h2>
            <p className="text-sm text-[#3e4850]">Email: {user?.email || 'N/A'} · Role: {user?.role || 'Patient'}</p>
          </div>
          <button className="ml-auto flex items-center gap-1.5 border border-[#006591] text-[#006591] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#006591]/10 transition-colors">
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Details
          </button>
        </div>

        {/* Doctor view AI summary */}
        {role === 'doctor' && (
          <div className="space-y-3 mb-6">
            <div className="bg-[#bae6fd] rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#006591]">auto_awesome</span>
              <div>
                <p className="font-bold text-[#3d687c] text-sm mb-1">AI Clinical Summary</p>
                <p className="text-sm text-[#3e4850]">Patient exhibits Moderate hereditary risk with BI-RADS 3 mammogram findings. Family history indicates BRCA1 mutation. Recommend biopsy evaluation and genetic counseling.</p>
              </div>
            </div>
            <div className="bg-[#ffdad6] rounded-2xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-[#ba1a1a]">genetics</span>
              <div>
                <p className="font-bold text-[#93000a] text-sm mb-1">Hereditary Alert</p>
                <p className="text-sm text-[#93000a]">Maternal grandmother and mother have documented breast cancer and BRCA1 mutation. Patient requires urgent genetic counseling referral.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-[#bec8d2]/30 mb-6 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-3 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === i
                    ? 'border-b-2 border-[#006591] text-[#006591] font-bold'
                    : 'text-[#3e4850] hover:text-[#171c20] hover:bg-[#f0f4fa]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 0 && (
          <div className="bg-white rounded-2xl border border-[#bec8d2]/30 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-[#f0f4fa] border-b border-[#bec8d2]/30">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#3e4850] uppercase">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#3e4850] uppercase">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#3e4850] uppercase">Extracted Symptoms</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#3e4850] uppercase">Confirmed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bec8d2]/20">
                {localSymptoms.length > 0 ? localSymptoms.map(s => (
                  <tr key={s.symptom_id} className="hover:bg-[#f0f4fa]/50">
                    <td className="px-4 py-3 text-[#3e4850]">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.input_type === 'text' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                        {s.input_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.extracted_symptoms.map(sym => (
                          <span key={sym} className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full">{sym}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="material-symbols-outlined text-xl" style={{ color: s.is_confirmed ? '#16a34a' : '#ba1a1a' }}>
                        {s.is_confirmed ? 'check_circle' : 'cancel'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-sm text-[#3e4850] italic">
                      No symptoms recorded yet. Visit the Symptom AI to analyze and record your symptoms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 1 && (
          <div className="grid md:grid-cols-2 gap-4">
            {mockImages.map(img => (
              <div key={img.image_id} className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">{img.image_type}</span>
                  <span className="bg-[#ffdcbd] text-[#8a5100] text-xs px-2 py-0.5 rounded-full">{img.birads_score}</span>
                  <span className="text-xs text-[#3e4850] ml-auto">{new Date(img.created_at).toLocaleDateString()}</span>
                </div>
                <div className="w-full h-32 bg-[#f0f4fa] rounded-xl flex items-center justify-center mb-3 border border-[#bec8d2]/20">
                  <span className="material-symbols-outlined text-[#3e4850]/30 text-4xl">radiology</span>
                </div>
                <p className="text-xs text-[#3e4850] mb-3 leading-relaxed">{img.ai_findings.slice(0, 90)}... <button className="text-[#006591] font-medium">Read more</button></p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#3e4850] mb-1">
                    <span>Risk Score</span>
                    <span className="font-bold">{(img.risk_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-[#0ea5e9]/20 rounded-full h-2">
                    <div className="bg-[#0ea5e9] h-2 rounded-full" style={{ width: `${img.risk_score * 100}%` }} />
                  </div>
                </div>
                <a href={img.file_url} className="text-[#006591] text-xs font-medium hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View File
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-4">
            {ocrDocs.map(doc => (
              <div key={doc.id} className="bg-white border border-[#006591] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#006591]">description</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">{doc.doc_type.replace('_', ' ')}</span>
                      <span className="font-bold text-sm text-[#006591]">{doc.filename || 'Uploaded Document'}</span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">AI Digitized</span>
                    </div>
                    <p className="text-xs text-[#3e4850] mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {doc.structured_data?.summary && (
                  <div className="bg-[#f6faff] rounded-xl p-4 border border-[#bae6fd] mb-3">
                    <p className="text-xs font-semibold text-[#006591] uppercase tracking-wide mb-1">AI Summary</p>
                    <p className="text-sm text-[#171c20] leading-relaxed">{doc.structured_data.summary}</p>
                  </div>
                )}
                
                <div className="bg-[#f0f4fa] rounded-xl p-4 mb-3 max-h-32 overflow-y-auto">
                  <p className="font-mono text-xs text-[#3e4850] leading-relaxed whitespace-pre-wrap">{doc.raw_text}</p>
                </div>
              </div>
            ))}
            
            {mockDocuments.map(doc => (
              <div key={doc.doc_id} className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-[#006591]">description</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">{doc.doc_type.replace('_', ' ')}</span>
                      <span className="font-medium text-sm text-[#171c20]">{doc.file_name}</span>
                    </div>
                    <p className="text-xs text-[#3e4850] mt-0.5">{new Date(doc.created_at).toLocaleDateString()}</p>
                  </div>
                  {doc.is_confirmed && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Confirmed
                    </span>
                  )}
                </div>
                <div className="bg-[#f0f4fa] rounded-xl p-4 mb-3">
                  <p className="font-mono text-xs text-[#3e4850] leading-relaxed">{doc.extracted_text.slice(0, 150)}...</p>
                </div>
                <a href={doc.file_url} className="text-[#006591] text-xs font-medium hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                  View File
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 3 && (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#bec8d2]/50" />
            <div className="space-y-6">
              {[mockRiskAssessment].map((r) => (
                <div key={r.assessment_id} className="relative pl-14">
                  <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-[#de8712] border-2 border-white shadow" />
                  <div className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#3e4850]">{new Date(r.created_at).toLocaleDateString()}</span>
                      <span className="bg-[#ffdcbd] text-[#8a5100] text-xs px-3 py-0.5 rounded-full font-medium">{r.risk_level} Risk</span>
                      <span className="text-sm font-bold text-[#de8712] ml-auto">{Math.round(r.generational_risk_score * 100)}%</span>
                    </div>
                    <div className="space-y-1 mb-3">
                      {r.contributing_factors.map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#3e4850]">
                          <span className="material-symbols-outlined text-[#de8712] text-sm mt-0.5">report_problem</span>
                          {f}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-[#3e4850] bg-[#f0f4fa] rounded-lg p-3">{r.recommended_action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[700px]">
              {/* Grandparents row */}
              <div className="flex justify-center gap-4 mb-8">
                {mockFamilyHistory.filter(f => f.member_relation.includes('grandfather') || f.member_relation.includes('grandmother')).map(m => (
                  <div
                    key={m.family_id}
                    className={`bg-white border-2 rounded-2xl p-3 text-center min-w-[130px] shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                      m.conditions.some(c => ['Breast Cancer', 'Ovarian Cancer'].includes(c))
                        ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                        : m.conditions.some(c => c.includes('BRCA'))
                        ? 'border-[#de8712]'
                        : 'border-[#bec8d2]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#3e4850]/60 text-3xl">account_circle</span>
                    <p className="text-xs text-[#3e4850] mt-1 mb-2">{formatRelation(m.member_relation)}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {m.conditions.map(c => (
                        <span key={c} className={`text-xs px-1.5 py-0.5 rounded-full ${c.includes('Cancer') || c.includes('BRCA') ? 'bg-[#ffdad6] text-[#93000a]' : 'bg-[#f0f4fa] text-[#3e4850]'}`}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Parents row */}
              <div className="flex justify-center gap-8 mb-8">
                {mockFamilyHistory.filter(f => f.member_relation === 'father' || f.member_relation === 'mother').map(m => (
                  <div
                    key={m.family_id}
                    className={`bg-white border-2 rounded-2xl p-3 text-center min-w-[130px] shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                      m.conditions.some(c => c.includes('BRCA')) ? 'border-[#de8712]' : 'border-[#bec8d2]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#3e4850]/60 text-3xl">account_circle</span>
                    <p className="text-xs text-[#3e4850] mt-1 mb-2">{formatRelation(m.member_relation)}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {m.conditions.map(c => (
                        <span key={c} className={`text-xs px-1.5 py-0.5 rounded-full ${c.includes('BRCA') ? 'bg-[#ffdcbd] text-[#8a5100]' : 'bg-[#f0f4fa] text-[#3e4850]'}`}>{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Patient + sibling */}
              <div className="flex justify-center gap-8">
                <div className="bg-white border-2 border-[#006591] rounded-2xl p-3 text-center min-w-[140px] shadow-md">
                  <div className="w-10 h-10 rounded-full bg-[#006591] flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">{user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}</div>
                  <p className="text-sm font-bold text-[#171c20]">{user?.full_name || 'Jane Doe'}</p>
                  <p className="text-xs text-[#3e4850]">PATIENT PROFILE</p>
                </div>
                {mockFamilyHistory.filter(f => f.member_relation === 'sibling').map(m => (
                  <div key={m.family_id} className="bg-white border-2 border-[#bec8d2]/40 rounded-2xl p-3 text-center min-w-[130px] shadow-sm">
                    <span className="material-symbols-outlined text-[#3e4850]/60 text-3xl">account_circle</span>
                    <p className="text-xs text-[#3e4850] mt-1 mb-2">{formatRelation(m.member_relation)}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {m.conditions.map(c => (
                        <span key={c} className="text-xs bg-[#f0f4fa] text-[#3e4850] px-1.5 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 5 && (
          <div className="space-y-3">
            {mockConsultations.map(c => (
              <div key={c.consultation_id} className="bg-white border border-[#bec8d2]/30 rounded-2xl p-5 flex flex-wrap items-center gap-4 shadow-sm">
                <div className="flex-1">
                  <p className="font-bold text-[#171c20] text-sm">{c.doctor_name}</p>
                  <p className="text-xs text-[#3e4850] mt-0.5">Breast Oncologist · City Medical Center</p>
                  <p className="text-xs text-[#3e4850] mt-1">{new Date(c.initiated_at).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  c.status === 'active' ? 'bg-green-100 text-green-700'
                  : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-[#eaeef4] text-[#3e4850]'
                }`}>
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
                {c.status === 'active' && (
                  <Link
                    to={`/consultation-chat/${c.consultation_id}`}
                    className="bg-[#006591] text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#005070] transition-colors"
                  >
                    Continue Chat
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
