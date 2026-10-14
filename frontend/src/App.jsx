import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <Router>
          <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-6">
              <AppRoutes />
            </main>
            <Footer />
            <AuthModal />
          </div>
        </Router>
      </AuthProvider>
    </LangProvider>
  );
}