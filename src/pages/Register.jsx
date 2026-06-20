import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const specializations = ['Breast Oncologist', 'Radiologist', 'Genetic Counselor', 'General Practice', 'Oncology'];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', email: '', phone: '', password: '', confirmPassword: '',
    licenseNumber: '', specialization: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = 'First name is required.';
    if (!form.lastName) errs.lastName = 'Last name is required.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email is required.';
    if (!form.password || form.password.length < 8) errs.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!agreed) errs.terms = 'You must agree to the terms.';
    if (role === 'doctor') {
      if (!form.licenseNumber) errs.licenseNumber = 'License number is required.';
      if (!form.specialization) errs.specialization = 'Specialization is required.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate(role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
      }, 1200);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-[#f0f4fa] border rounded-lg text-sm text-[#171c20] placeholder-[#3e4850]/50 focus:outline-none transition-colors ${
      errors[field] ? 'border-[#ba1a1a]' : 'border-[#bec8d2]/60 focus:border-[#006591]'
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left column */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] min-w-[420px] bg-gradient-to-b from-[#006591] to-[#005070] text-white p-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">health_and_safety</span>
          </div>
          <span className="text-white font-bold text-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>Smart Health</span>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 mb-6 text-xs">
            <span className="material-symbols-outlined text-sm">verified</span>
            Clinical Precision AI
          </div>
          <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
            Join our network of healthcare professionals and patients.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Get personalized risk assessments, connect with top-rated oncologists, and take control of your health journey with AI-powered insights.
          </p>
          <div className="mt-8 space-y-4">
            {['HIPAA Compliant Platform', 'AI-Powered Diagnostics', 'Board-Certified Specialists', '256-bit Encrypted Data'].map(f => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/80">
                <span className="material-symbols-outlined text-[#89ceff] text-lg">check_circle</span>
                {f}
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© 2024 Smart Health Care System</p>
      </div>

      {/* Right column */}
      <div className="flex-1 overflow-y-auto bg-[#f0f4fa] py-10 px-6 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#006591]" style={{ fontFamily: 'Manrope, sans-serif' }}>Create Your Account</h1>
            <p className="text-[#3e4850] mt-1 text-sm">Please fill in your details to access the Smart Health platform.</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-4 mb-8">
            {[
              { val: 'patient', icon: 'person', label: 'Patient', desc: 'Track your health & get AI analysis' },
              { val: 'doctor', icon: 'stethoscope', label: 'Doctor', desc: 'Manage patients & consultations' },
            ].map((r) => (
              <button
                key={r.val}
                type="button"
                onClick={() => setRole(r.val)}
                className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                  role === r.val
                    ? 'border-[#006591] bg-white shadow-md'
                    : 'border-[#bec8d2]/50 bg-[#f0f4fa] hover:border-[#006591]/40'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${role === r.val ? 'bg-[#006591]' : 'bg-[#bec8d2]/40'}`}>
                  <span className={`material-symbols-outlined text-xl ${role === r.val ? 'text-white' : 'text-[#3e4850]'}`}>{r.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#171c20] text-sm">{r.label}</p>
                    {role === r.val && (
                      <span className="material-symbols-outlined text-[#006591] text-lg">check_circle</span>
                    )}
                  </div>
                  <p className="text-xs text-[#3e4850]">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal info grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">First Name *</label>
                <input type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Jane" className={inputClass('firstName')} />
                {errors.firstName && <p className="text-[#ba1a1a] text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Last Name *</label>
                <input type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Doe" className={inputClass('lastName')} />
                {errors.lastName && <p className="text-[#ba1a1a] text-xs mt-1">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => update('dob', e.target.value)} className={inputClass('dob')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputClass('phone')} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Email Address *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane.doe@example.com" className={inputClass('email')} />
                {errors.email && <p className="text-[#ba1a1a] text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Password *</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters" className={inputClass('password')} />
                {errors.password && <p className="text-[#ba1a1a] text-xs mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#171c20] mb-1.5">Confirm Password *</label>
                <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} placeholder="Repeat password" className={inputClass('confirmPassword')} />
                {errors.confirmPassword && <p className="text-[#ba1a1a] text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            <p className="text-xs text-[#3e4850] -mt-4">Must be at least 8 characters with a mix of letters and numbers.</p>

            {/* Doctor fields */}
            {role === 'doctor' && (
              <div className="bg-white rounded-xl p-5 border border-[#bec8d2]/30 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-[#006591]">badge</span>
                  <h3 className="font-bold text-[#171c20] text-sm" style={{ fontFamily: 'Manrope, sans-serif' }}>Professional Credentials</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#171c20] mb-1.5">Medical License Number *</label>
                    <input type="text" value={form.licenseNumber} onChange={e => update('licenseNumber', e.target.value)} placeholder="ML-XXXXXXX" className={inputClass('licenseNumber')} />
                    {errors.licenseNumber && <p className="text-[#ba1a1a] text-xs mt-1">{errors.licenseNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#171c20] mb-1.5">Specialization *</label>
                    <select value={form.specialization} onChange={e => update('specialization', e.target.value)} className={inputClass('specialization')}>
                      <option value="">Select specialization</option>
                      {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.specialization && <p className="text-[#ba1a1a] text-xs mt-1">{errors.specialization}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#006591]"
              />
              <span className="text-sm text-[#3e4850]">
                I agree to the <a href="#" className="text-[#006591] hover:underline">Terms of Service</a> and <a href="#" className="text-[#006591] hover:underline">Privacy Policy</a>, and consent to HIPAA compliant data handling.
              </span>
            </label>
            {errors.terms && <p className="text-[#ba1a1a] text-xs -mt-4">{errors.terms}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-xl hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 text-base"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#3e4850] mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#006591] font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
