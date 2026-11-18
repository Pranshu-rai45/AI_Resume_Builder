import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ResumeProvider } from './context/ResumeContext';
import AppRouter from './router/AppRouter';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ResumeProvider>
            <AppRouter />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1E293B',
                  color: '#E2E8F0',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                },
                success: {
                  iconTheme: { primary: '#10B981', secondary: '#fff' }
                },
                error: {
                  iconTheme: { primary: '#EF4444', secondary: '#fff' }
                }
              }}
            />
          </ResumeProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
