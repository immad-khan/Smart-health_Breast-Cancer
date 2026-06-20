import { createContext, useContext, useState } from 'react';
import { mockUser } from '../data/mockData';

const AuthContext = createContext();

export function MockAuthProvider({ children }) {
  const [user, setUser] = useState(mockUser);
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    setRole(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, role, logout, switchRole, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
