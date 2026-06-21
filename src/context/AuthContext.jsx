import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from local storage on mount
    const storedUser = localStorage.getItem('smart_health_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData, token) => {
    setUser(userData);
    localStorage.setItem('smart_health_user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('smart_health_token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_health_user');
    localStorage.removeItem('smart_health_token');
  };

  // Ensure role is a string if it exists in user object
  const role = user?.role || 'patient';

  return (
    <AuthContext.Provider value={{ user, role, loginUser, logout, isAuthenticated: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
