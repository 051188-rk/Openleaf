import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { TemplateSelector } from './pages/TemplateSelector';
import { InputForm } from './pages/InputForm';
import { ResultView } from './pages/ResultView';
import { EditorPage } from './pages/EditorPage';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import './index.css';

function AppContent() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/';

    return (
        <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
            {!isAuthPage && <Header />}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/templates"
                    element={
                        <ProtectedRoute>
                            <TemplateSelector />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/input"
                    element={
                        <ProtectedRoute>
                            <InputForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/result"
                    element={
                        <ProtectedRoute>
                            <ResultView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor"
                    element={
                        <ProtectedRoute>
                            <EditorPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
