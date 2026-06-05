import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = useCallback((userRole, userName = 'User') => {
    setRole(userRole);
    setUser({ name: userName, role: userRole });
  }, []);

  const logout = useCallback(() => {
    setRole(null);
    setUser(null);
  }, []);

  const hasPermission = useCallback((requiredRole) => {
    return role === requiredRole;
  }, [role]);

  return {
    user,
    role,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };
};