import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { mockUser } from '../data/mockData';

const TABS = [
  { label: 'Profile', icon: 'person' },
  { label: 'Security', icon: 'security' },
  { label: 'Notifications', icon: 'notifications' },
  { label: 'Privacy', icon: 'visibility_off' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function Settings() {
  const { user, role, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    firstName: 'Jane', lastName: 'Doe', email: mockUser.email,
    dob: '1990-01-15', bloodType: 'O+', phone: '+1 555 000 0000', address: '123 Health St, New York, NY',
    specialty: 'Breast Oncologist', qualification: 'MD, FRCS', hospital: 'City Medical Center', city: 'New York',
  });
  const [saved, setSaved] = useState(false);

  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [notifs, setNotifs] = useState({ aiResults: true, doctorReplies: true, reminders: false, security: true });
  const [privacy, setPrivacy] = useState({ dataSharing: true, analytics: false });

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const getStrength = (pass) => {
    if (!pass) return 0;
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };
  const strength = getStrength(newPass);
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', '#ba1a1a', '#de8712', '#22c55e', '#15803d'][strength];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const inputCls = "w-full px-4 py-2.5 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-xl text-sm text-[#171c20] focus:outline-none focus:border-[#006591] transition-colors";
  const readCls = "w-full px-4 py-2.5 bg-[#eaeef4] border border-[#bec8d2]/40 rounded-xl text-sm text-[#3e4850] cursor-not-allowed";

  return (
    <Layout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Settings</h1>
          <p className="text-[#3e4850] text-sm mt-1">Manage your account preferences, security, and data privacy.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs sidebar */}
          <div className="md:w-56 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === i
                    ? 'bg-[#0ea5e9]/10 text-[#006591] font-bold'
                    : 'text-[#3e4850] hover:bg-[#eaeef4]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1">
            {/* Profile Tab */}
            {activeTab === 0 && (
              <div className="space-y-5">
                <div className="bg-white border border-[#bae6fd] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#171c20] mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Profile Information</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-[#0ea5e9]/20 border-2 border-[#bec8d2] flex items-center justify-center text-[#006591] font-bold text-2xl overflow-hidden">
                        JD
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-[#171c20] text-sm">{form.firstName} {form.lastName}</p>
                      <button className="text-[#006591] text-xs hover:underline mt-1">Change Photo</button>
                    </div>
                  </div>

                  {saved && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-4 text-sm">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                      Profile updated successfully!
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">First Name</label>
                      <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Last Name</label>
                      <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5 flex items-center gap-1">
                        Email Address <span className="material-symbols-outlined text-sm text-[#3e4850]/50">lock</span>
                      </label>
                      <input type="email" value={form.email} readOnly className={readCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Date of Birth</label>
                      <input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Blood Type</label>
                      <select value={form.bloodType} onChange={e => update('bloodType', e.target.value)} className={inputCls}>
                        {BLOOD_TYPES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Contact Number</label>
                      <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className={inputCls} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Address</label>
                      <textarea value={form.address} onChange={e => update('address', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
                    </div>

                    {role === 'doctor' && (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Specialty</label>
                          <input type="text" value={form.specialty} onChange={e => update('specialty', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Qualification</label>
                          <input type="text" value={form.qualification} onChange={e => update('qualification', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Hospital Name</label>
                          <input type="text" value={form.hospital} onChange={e => update('hospital', e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-[#3e4850] mb-1.5">City</label>
                          <input type="text" value={form.city} onChange={e => update('city', e.target.value)} className={inputCls} />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button onClick={() => setSaved(false)} className="px-5 py-2.5 border border-[#006591] text-[#006591] font-bold rounded-xl text-sm hover:bg-[#006591]/10 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-5 py-2.5 bg-[#006591] text-white font-bold rounded-xl text-sm hover:bg-[#005070] transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Account info */}
                <div className="bg-[#f0f4fa] rounded-2xl p-5 border border-[#bec8d2]/30">
                  <h3 className="font-bold text-[#171c20] text-sm mb-3" style={{ fontFamily: 'Manrope, sans-serif' }}>Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3e4850]">Full Name</span>
                      <span className="text-[#171c20] font-medium">{form.firstName} {form.lastName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3e4850]">Email</span>
                      <span className="text-[#171c20] font-medium">{form.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3e4850]">Role</span>
                      <span className="bg-[#bae6fd] text-[#3d687c] text-xs px-2 py-0.5 rounded-full capitalize">{role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#3e4850]">Member Since</span>
                      <span className="text-[#171c20] font-medium">January 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 1 && (
              <div className="bg-white border border-[#bae6fd] rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#171c20] mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Current Password</label>
                    <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} className={inputCls} placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#3e4850] mb-1.5">New Password</label>
                    <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} className={inputCls} placeholder="Enter new password" />
                    {newPass && (
                      <div className="mt-2">
                        <div className="w-full bg-[#dee3e9] rounded-full h-2 mb-1">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${strength * 25}%`, backgroundColor: strengthColor }} />
                        </div>
                        <p className="text-xs" style={{ color: strengthColor }}>Password strength: {strengthLabel}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#3e4850] mb-1.5">Confirm New Password</label>
                    <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className={inputCls} placeholder="Repeat new password" />
                    {confirmPass && newPass !== confirmPass && (
                      <p className="text-[#ba1a1a] text-xs mt-1">Passwords do not match.</p>
                    )}
                  </div>
                  <button className="bg-[#006591] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#005070] transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 2 && (
              <div className="bg-white border border-[#bae6fd] rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-[#171c20] mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: 'aiResults', title: 'AI Risk Results', desc: 'Receive alerts when new analyses are complete' },
                    { key: 'doctorReplies', title: 'Doctor Replies', desc: 'Get notified when a clinician responds' },
                    { key: 'reminders', title: 'Appointment Reminders', desc: 'Get reminded of upcoming consultations' },
                    { key: 'security', title: 'Security Alerts', desc: 'Account login notifications' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#f0f4fa] border border-[#bec8d2]/20">
                      <div>
                        <p className="font-semibold text-[#171c20] text-sm">{title}</p>
                        <p className="text-xs text-[#3e4850] mt-0.5">{desc}</p>
                      </div>
                      <Toggle checked={notifs[key]} onChange={() => setNotifs(n => ({ ...n, [key]: !n[key] }))} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 3 && (
              <div className="space-y-5">
                <div className="bg-white border border-[#bae6fd] rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-[#171c20] mb-5" style={{ fontFamily: 'Manrope, sans-serif' }}>Privacy Settings</h2>
                  <div className="space-y-4 mb-6">
                    {[
                      { key: 'dataSharing', title: 'Data Sharing', desc: 'Allow anonymized data to improve AI models' },
                      { key: 'analytics', title: 'Analytics', desc: 'Allow usage analytics for platform improvements' },
                    ].map(({ key, title, desc }) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[#f0f4fa] border border-[#bec8d2]/20">
                        <div>
                          <p className="font-semibold text-[#171c20] text-sm">{title}</p>
                          <p className="text-xs text-[#3e4850] mt-0.5">{desc}</p>
                        </div>
                        <Toggle checked={privacy[key]} onChange={() => setPrivacy(p => ({ ...p, [key]: !p[key] }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="border border-[#006591] text-[#006591] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#006591]/10 transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">download</span>
                      Download My Data
                    </button>
                    <button className="border border-[#ba1a1a] text-[#ba1a1a] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#ba1a1a]/10 transition-colors flex items-center gap-2">
                      <span className="material-symbols-outlined text-lg">delete_forever</span>
                      Request Data Deletion
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/30 rounded-2xl p-6">
                  <h3 className="font-bold text-[#ba1a1a] mb-2" style={{ fontFamily: 'Manrope, sans-serif' }}>Danger Zone</h3>
                  <p className="text-sm text-[#3e4850] mb-4">Permanently delete your account and all associated health data. This action cannot be undone.</p>
                  <button
                    onClick={() => setDeleteModal(true)}
                    className="border border-[#ba1a1a] text-[#ba1a1a] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#ba1a1a]/10 transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#ba1a1a] text-2xl">warning</span>
              <h2 className="text-xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Are you sure?</h2>
            </div>
            <p className="text-sm text-[#3e4850] mb-4">This will permanently delete your account and all health records. Type <strong>DELETE</strong> to confirm.</p>
            <input
              type="text"
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full px-4 py-2.5 bg-[#f0f4fa] border border-[#ba1a1a]/40 rounded-xl text-sm mb-4 focus:outline-none focus:border-[#ba1a1a]"
            />
            <div className="flex gap-3">
              <button onClick={() => { setDeleteModal(false); setDeleteInput(''); }} className="flex-1 border border-[#006591] text-[#006591] font-bold py-2.5 rounded-xl text-sm hover:bg-[#006591]/10 transition-colors">
                Cancel
              </button>
              <button
                onClick={() => { if (deleteInput === 'DELETE') logout(); }}
                disabled={deleteInput !== 'DELETE'}
                className="flex-1 bg-[#ba1a1a] text-white font-bold py-2.5 rounded-xl text-sm hover:bg-[#93000a] transition-colors disabled:opacity-50"
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
