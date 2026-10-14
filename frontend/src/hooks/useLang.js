import { useContext } from 'react';
import { LangContext } from '../context/LangContext'; // Ensure LangContext is exported from your context file

export function useLang() {
  const context = useContext(LangContext);
  
  if (context === undefined) {
    throw new Error('useLang must be used within a LangProvider. Wrap your App in <LangProvider>.');
  }
  
  return context;
}