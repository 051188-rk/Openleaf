import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import logoMain from '../assets/logo_main.png';
import loginImage from '../assets/login.png';
import '../styles/auth.css';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const from = (location.state as any)?.from?.pathname || '/templates';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-split-layout">
                {/* Left Panel: Form */}
                <div className="auth-panel-form">
                    <Link to="/" className="auth-back-link">
                        <FiArrowLeft /> Back to Home
                    </Link>

                    <div className="auth-form-container" style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
                        <div className="auth-logo">
                            <img src={logoMain} alt="Openleaf" style={{ height: '32px' }} />
                        </div>

                        <div className="auth-header">
                            <h1>Welcome Back</h1>
                            <p>Log in to continue creating your professional resume</p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <FiAlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-wrapper">
                                    <input
                                        id="email"
                                        type="email"
                                        className="input"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <FiMail className="input-icon" size={18} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <input
                                        id="password"
                                        type="password"
                                        className="input"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <FiLock className="input-icon" size={18} />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-auth"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Log In'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Don't have an account?
                            <Link to="/signup" className="auth-link">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Visual */}
                <div className="auth-panel-visual">
                    <div className="visual-content">
                        <div className="hero-showcase">
                            <img src={loginImage} alt="Login Preview" className="hero-image-styled" />

                            <div className="testimonial-card">
                                <p className="testimonial-text">
                                    "Openleaf completely transformed how I apply for jobs. The AI suggestions are uncannily accurate and saved me hours of formatting!"
                                </p>
                                <div className="testimonial-user">
                                    <div className="user-avatar">AM</div>
                                    <div className="user-info">
                                        <h4>Alex Morgan</h4>
                                        <span>Software Engineer</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
