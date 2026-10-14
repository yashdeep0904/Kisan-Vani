import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure AuthContext is exported from your context file

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider. Wrap your App in <AuthProvider>.');
  }
  
  return context;
}