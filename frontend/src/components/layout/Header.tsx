import { FiLogOut, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoMain from '../../assets/logo_main.png';

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
            borderBottom: '1px solid var(--gray-200)',
            padding: '0.75rem 0'
        }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="flex items-center gap-3">
                            <img
                                src={logoMain}
                                alt="Openleaf Logo"
                                style={{
                                    height: '36px',
                                    objectFit: 'contain'
                                }}
                            />
                        </div>
                    </Link>

                    {isAuthenticated && user && (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2" style={{
                                padding: '0.375rem 0.75rem',
                                background: 'var(--gray-50)',
                                borderRadius: '4px',
                                border: '1px solid var(--gray-200)'
                            }}>
                                <FiUser size={16} color="var(--gray-600)" />
                                <span style={{
                                    fontSize: '0.813rem',
                                    fontWeight: 500,
                                    color: 'var(--gray-700)'
                                }}>
                                    {user.name}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn-outline"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    padding: '0.375rem 0.875rem',
                                    fontSize: '0.813rem'
                                }}
                            >
                                <FiLogOut size={16} />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
