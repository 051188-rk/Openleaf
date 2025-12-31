import { FiFileText, FiLogOut, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Header() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={{
            background: 'var(--white)',
            borderBottom: '2px solid var(--gray-200)',
            padding: '1.5rem 0'
        }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="flex items-center gap-3">
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'var(--black)',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--white)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}>
                                <FiFileText size={28} />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>res-gen</h1>
                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>
                                    AI Resume Generator
                                </p>
                            </div>
                        </div>
                    </Link>

                    {isAuthenticated && user && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2" style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--gray-100)',
                                borderRadius: '10px',
                                border: '1px solid var(--gray-200)'
                            }}>
                                <FiUser size={18} color="var(--gray-600)" />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--gray-700)' }}>
                                    {user.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-outline"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.625rem 1.25rem',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <FiLogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
