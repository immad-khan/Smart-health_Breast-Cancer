import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [step, setStep] = useState('email_entry'); // email_entry | otp_entry | new_password | success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8002/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to request OTP');
      setStep('otp_entry');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) return;
    setStep('new_password');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8002/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to reset password');
      setStep('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#bec8d2]/30 p-8">
        <Link to="/login" className="flex items-center gap-1 text-[#006591] text-sm hover:underline mb-6">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Login
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#006591] rounded-2xl flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-white text-2xl">lock_reset</span>
          </div>
          <h1 className="text-2xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>
            {step === 'success' ? 'Password Reset' : 'Forgot Password?'}
          </h1>
          <p className="text-[#3e4850] text-sm mt-1 text-center">
            {step === 'email_entry' && 'Enter your email to receive a reset code.'}
            {step === 'otp_entry' && 'Enter the 6-digit code sent to your email.'}
            {step === 'new_password' && 'Create a new secure password.'}
            {step === 'success' && 'Your password has been successfully reset.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="material-symbols-outlined text-xl">error</span>
            {error}
          </div>
        )}

        {step === 'email_entry' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#171c20] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane.doe@example.com"
                required
                className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm focus:outline-none focus:border-[#006591] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-lg hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Sending...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  Send Reset Code
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp_entry' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#171c20] mb-1.5">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm text-center tracking-widest text-lg font-bold focus:outline-none focus:border-[#006591] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-lg hover:bg-[#005070] transition-colors flex items-center justify-center gap-2"
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 'new_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#171c20] mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm focus:outline-none focus:border-[#006591] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e4850] hover:text-[#006591]"
                >
                  <span className="material-symbols-outlined text-xl">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171c20] mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm focus:outline-none focus:border-[#006591] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e4850] hover:text-[#006591]"
                >
                  <span className="material-symbols-outlined text-xl">{showConfirmPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-lg hover:bg-[#005070] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                  Updating...
                </>
              ) : 'Update Password'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-4 mb-5 text-sm justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
              <p className="font-semibold">Password updated successfully!</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#006591] text-white font-bold py-3.5 rounded-lg hover:bg-[#005070] transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
