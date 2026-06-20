import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('@')) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1200);
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
          <h1 className="text-2xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Forgot Password?</h1>
          <p className="text-[#3e4850] text-sm mt-1 text-center">Enter your email to receive a reset link.</p>
        </div>

        {status === 'success' && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-4 mb-5 text-sm">
            <span className="material-symbols-outlined text-xl">mark_email_read</span>
            <div>
              <p className="font-semibold">Reset link sent!</p>
              <p>Check your inbox at <strong>{email}</strong>.</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] rounded-xl px-4 py-3 mb-5 text-sm">
            <span className="material-symbols-outlined text-xl">error</span>
            Email not found in our system.
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        )}

        {status === 'success' && (
          <div className="text-center mt-4">
            <Link to="/login" className="text-[#006591] font-semibold text-sm hover:underline">Return to Login</Link>
          </div>
        )}
      </div>
    </div>
  );
}
