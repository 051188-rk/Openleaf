import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import logoMain from '../assets/logo_main.png';
import signupImage from '../assets/signup.png';
import '../styles/auth.css';

export function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(formData.email, formData.password, formData.name);
            navigate('/templates');
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
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
                            <h1>Create Account</h1>
                            <p>Start building your professional future today</p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                <FiAlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <div className="input-wrapper">
                                    <input
                                        id="name"
                                        type="text"
                                        className="input"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <FiUser className="input-icon" size={18} />
                                </div>
                            </div>

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
                                        minLength={6}
                                        maxLength={50}
                                    />
                                    <FiLock className="input-icon" size={18} />
                                </div>
                                <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                                    Must be at least 6 characters
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="btn-auth"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account?
                            <Link to="/login" className="auth-link">
                                Log in
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Visual */}
                <div className="auth-panel-visual">
                    <div className="visual-content">
                        <div className="hero-showcase">
                            <img src={signupImage} alt="Signup Preview" className="hero-image-styled" />

                            <div className="testimonial-card">
                                <p className="testimonial-text">
                                    "I got callbacks from top tech companies within a week of using Openleaf. The templates are clean, professional, and ATS-friendly."
                                </p>
                                <div className="testimonial-user">
                                    <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>SJ</div>
                                    <div className="user-info">
                                        <h4>Sarah Jenkins</h4>
                                        <span>Product Designer</span>
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
