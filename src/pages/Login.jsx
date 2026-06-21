import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      loginUser(data.user, data.access_token);
      
      if (data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-[#bec8d2]/30 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#006591] rounded-2xl flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-white text-2xl">health_and_safety</span>
          </div>
          <h1 className="text-2xl font-bold text-[#171c20]" style={{ fontFamily: 'Manrope, sans-serif' }}>Welcome Back</h1>
          <p className="text-[#3e4850] text-sm mt-1">Sign in to your clinical dashboard</p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-2 bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] rounded-lg px-4 py-3 mb-4 text-sm">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#171c20] mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane.doe@example.com"
              className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm text-[#171c20] placeholder-[#3e4850]/50 focus:outline-none focus:border-[#006591] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#171c20] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-[#f0f4fa] border border-[#bec8d2]/60 rounded-lg text-sm text-[#171c20] placeholder-[#3e4850]/50 focus:outline-none focus:border-[#006591] transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3e4850] hover:text-[#006591]"
              >
                <span className="material-symbols-outlined text-xl">{showPass ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <div className="text-right mt-1">
              <Link to="/forgot-password" className="text-xs text-[#006591] hover:underline">Forgot password?</Link>
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
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        {/* Removed Role toggle demo since we use real backend auth now */}

        <p className="text-center text-sm text-[#3e4850] mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#006591] font-semibold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
