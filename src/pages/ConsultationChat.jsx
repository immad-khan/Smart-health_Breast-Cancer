import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { mockMessages, mockRiskAssessment, mockDoctorUser } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export default function ConsultationChat() {
  const { user, role } = useAuth();
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = {
      msg_id: `m-${Date.now()}`,
      consultation_id: 'c-001',
      sender_id: user?.user_id || 'u-001',
      sender_role: role,
      sender_name: user?.full_name || 'Jane Doe',
      message_text: input,
      sent_at: new Date().toISOString(),
      is_read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (msg) => {
    return role === 'patient' ? msg.sender_role === 'patient' : msg.sender_role === 'doctor';
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-65px)] overflow-hidden">
        {/* Left info panel */}
        <div className="hidden lg:flex flex-col w-72 min-w-[280px] border-r border-[#bec8d2]/20 bg-[#f0f4fa] p-4 gap-4 overflow-y-auto">
          {role === 'patient' ? (
            <>
              {/* Doctor info */}
              <div className="bg-white rounded-2xl p-4 border border-[#bec8d2]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold">SA</div>
                  <div>
                    <p className="font-bold text-[#171c20] text-sm">{mockDoctorUser.full_name}</p>
                    <p className="text-xs text-[#006591]">{mockDoctorUser.specialty}</p>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">star</span>
                      <span className="text-xs">4.9 · 15 Yrs Exp</span>
                    </div>
                  </div>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Active Consultation
                </span>
              </div>

              {/* Patient context */}
              <div className="bg-white rounded-2xl p-4 border border-[#bec8d2]/30 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#3e4850] text-lg">format_list_bulleted</span>
                  <p className="font-semibold text-[#171c20] text-xs uppercase tracking-wide">Patient Context</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#3e4850] font-medium mb-1">Chief Complaint</p>
                    <p className="text-xs text-[#171c20]">Persistent breast pain, lump detected in upper outer area.</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#3e4850] font-medium mb-1">Active Symptoms</p>
                    <div className="flex flex-wrap gap-1">
                      {['Breast Pain', 'Lump'].map(s => (
                        <span key={s} className="bg-[#ffdad6] text-[#93000a] text-xs px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#3e4850] font-medium mb-1">Family History Flag</p>
                    <div className="bg-[#ffdcbd]/30 rounded-lg p-2 flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[#de8712] text-sm">warning</span>
                      <p className="text-xs text-[#8a5100]">Maternal BRCA1 mutation. Grandmother: Breast Cancer at 58.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest vitals */}
              <div className="bg-white rounded-2xl p-4 border border-[#bec8d2]/30 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[#3e4850] text-lg">vital_signs</span>
                  <p className="font-semibold text-[#171c20] text-xs uppercase tracking-wide">Latest Vitals</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'BPM', value: '78', icon: 'favorite', color: 'text-[#006591]' },
                    { label: 'BP', value: '120/80', icon: 'bloodtype', color: 'text-[#006591]' },
                  ].map(v => (
                    <div key={v.label}>
                      <div className="flex items-center gap-1 text-[#3e4850] text-xs mb-1">
                        <span className="material-symbols-outlined text-sm">{v.icon}</span>
                        {v.label}
                      </div>
                      <p className={`text-lg font-bold ${v.color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>{v.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Link to="/ehr" className="text-center border border-[#006591] text-[#006591] font-semibold py-2.5 rounded-xl text-sm hover:bg-[#006591]/10 transition-colors">
                View My EHR
              </Link>
            </>
          ) : (
            <>
              {/* Patient info for doctor */}
              <div className="bg-white rounded-2xl p-4 border border-[#bec8d2]/30 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold">JD</div>
                  <div>
                    <p className="font-bold text-[#171c20] text-sm">Jane Doe</p>
                    <span className="bg-[#ffdcbd] text-[#8a5100] text-xs px-2 py-0.5 rounded-full">Moderate Risk</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[#3e4850]">Top Risk Factors:</p>
                  {mockRiskAssessment.contributing_factors.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[#ba1a1a] text-sm mt-0.5">error</span>
                      <p className="text-xs text-[#3e4850]">{f}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-[#ffdad6] text-[#93000a] font-bold py-2.5 rounded-xl border border-[#ba1a1a]/30 text-sm hover:bg-[#ffdad6]/70 transition-colors">
                Close Consultation
              </button>
            </>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="bg-white border-b border-[#bec8d2]/30 px-5 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-sm">
                {role === 'patient' ? 'SA' : 'JD'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#171c20] text-sm">
                {role === 'patient' ? 'Dr. Sarah Ahmed' : 'Jane Doe'}
              </p>
              <p className="text-xs text-green-600">● Active Consultation</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[#ba1a1a] text-xs font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button className="p-2 rounded-lg hover:bg-[#f0f4fa] text-[#3e4850]">
                <span className="material-symbols-outlined text-xl">video_call</span>
              </button>
              <button className="p-2 rounded-lg hover:bg-[#f0f4fa] text-[#3e4850]">
                <span className="material-symbols-outlined text-xl">call</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 bg-[#f6faff]">
            {/* Date label */}
            <div className="flex justify-center">
              <span className="bg-[#eaeef4] text-[#3e4850] text-xs px-4 py-1.5 rounded-full">Today, 10:15 AM</span>
            </div>

            {/* AI Pre-brief */}
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-[#bae6fd] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#006591] text-sm">smart_toy</span>
              </div>
              <div className="bg-white border border-[#bae6fd] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <p className="text-xs font-bold text-[#006591] mb-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  AI Consultation Pre-Brief
                </p>
                <p className="text-xs text-[#3e4850] leading-relaxed">
                  Patient records have been analyzed. Mammogram shows BI-RADS 3 with mild asymmetry. Family history indicates BRCA1 mutation (maternal). Recommend reviewing risk assessment before proceeding.
                </p>
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.msg_id}
                className={`flex ${isOwnMessage(msg) ? 'justify-end' : 'justify-start'} items-end gap-2`}
              >
                {!isOwnMessage(msg) && (
                  <div className="w-7 h-7 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-xs flex-shrink-0">
                    {msg.sender_role === 'doctor' ? 'SA' : 'JD'}
                  </div>
                )}
                <div className={`flex flex-col max-w-[70%] ${isOwnMessage(msg) ? 'items-end' : 'items-start'}`}>
                  {!isOwnMessage(msg) && (
                    <span className="text-xs text-[#3e4850] mb-1 ml-1">{msg.sender_name}</span>
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isOwnMessage(msg)
                        ? 'bg-[#006591] text-white rounded-tr-sm'
                        : 'bg-white border border-[#bec8d2]/30 text-[#171c20] rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.message_text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isOwnMessage(msg) ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs text-[#3e4850]/60">{formatTime(msg.sent_at)}</span>
                    {isOwnMessage(msg) && (
                      <span className={`material-symbols-outlined text-sm ${msg.is_read ? 'text-[#006591]' : 'text-[#3e4850]/40'}`}>
                        done_all
                      </span>
                    )}
                  </div>
                </div>
                {isOwnMessage(msg) && (
                  <div className="w-7 h-7 rounded-full bg-[#006591]/20 flex items-center justify-center text-[#006591] font-bold text-xs flex-shrink-0">
                    {msg.sender_role === 'patient' ? 'JD' : 'SA'}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex items-end gap-2 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#006591] font-bold text-xs">SA</div>
              <div className="bg-white border border-[#bec8d2]/30 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center shadow-sm">
                <div className="w-2 h-2 bg-[#3e4850] rounded-full dot-1" />
                <div className="w-2 h-2 bg-[#3e4850] rounded-full dot-2" />
                <div className="w-2 h-2 bg-[#3e4850] rounded-full dot-3" />
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="bg-white border-t border-[#bec8d2]/30 p-4 flex gap-3 items-end flex-shrink-0">
            <button className="p-2 text-[#3e4850] hover:text-[#006591] hover:bg-[#f0f4fa] rounded-xl transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-xl">add_circle</span>
            </button>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type your message..."
              rows={1}
              className="flex-1 bg-[#f0f4fa] border border-[#bec8d2]/50 rounded-xl px-4 py-3 text-sm text-[#171c20] resize-none focus:outline-none focus:border-[#006591] transition-colors"
              style={{ maxHeight: '120px' }}
            />
            <button className="p-2 text-[#3e4850] hover:text-[#006591] hover:bg-[#f0f4fa] rounded-xl transition-colors flex-shrink-0">
              <span className="material-symbols-outlined text-xl">mic</span>
            </button>
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-[#006591] text-white px-4 py-3 rounded-xl hover:bg-[#005070] transition-colors disabled:opacity-50 flex items-center gap-1.5 font-bold text-sm flex-shrink-0"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </div>
        </div>

        {/* Right consult tools panel (desktop) */}
        <div className="hidden xl:flex flex-col w-64 border-l border-[#bec8d2]/20 bg-[#f0f4fa] p-4 gap-4 overflow-y-auto">
          <div>
            <p className="text-xs font-bold text-[#3e4850] uppercase tracking-wide mb-3">Consult Tools</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: 'videocam', label: 'Start Video' },
                { icon: 'edit_note', label: 'Prescribe' },
              ].map(t => (
                <button key={t.label} className="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-[#bec8d2]/30 hover:shadow-sm transition-shadow text-xs text-[#3e4850]">
                  <span className="material-symbols-outlined text-[#006591] text-2xl">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-[#3e4850] uppercase tracking-wide">Shared Media</p>
              <button className="text-xs text-[#006591] font-medium">View All</button>
            </div>
            <div className="space-y-2">
              <div className="bg-[#f0f4fa] rounded-xl overflow-hidden border border-[#bec8d2]/30">
                <div className="h-24 bg-[#dee3e9] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#3e4850]/40 text-3xl">radiology</span>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-[#171c20] truncate">mammogram_march.jpg</p>
                  <p className="text-xs text-[#3e4850]">Yesterday · Imaging Center</p>
                </div>
              </div>
              {['Lab_Results_Blood_Pa...', '12_Lead_ECG_Trace.pdf'].map((f, i) => (
                <div key={f} className="flex items-center gap-2 bg-white rounded-xl p-2.5 border border-[#bec8d2]/30">
                  <div className="w-8 h-8 bg-[#ffdcbd]/40 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#de8712] text-sm">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#171c20] truncate">{f}</p>
                    <p className="text-xs text-[#3e4850]">Oct {10 + i * 2} · {(1 + i * 0.1).toFixed(1)} MB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#3e4850] text-sm">edit_note</span>
              <p className="text-xs font-bold text-[#3e4850] uppercase tracking-wide">Session Notes</p>
            </div>
            <textarea
              placeholder="Private clinical notes..."
              rows={4}
              className="w-full bg-white border border-[#bec8d2]/30 rounded-xl px-3 py-2 text-xs text-[#171c20] resize-none focus:outline-none focus:border-[#006591] transition-colors"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
