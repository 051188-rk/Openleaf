import { FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <header style={{
            background: 'var(--white)',
            borderBottom: '2px solid var(--gray-200)',
            padding: '1.5rem 0'
        }}>
            <div className="container">
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
            </div>
        </header>
    );
}
