import { useLocation } from 'react-router-dom';
import { FiCode, FiFileText, FiDownload } from 'react-icons/fi';

interface LocationState {
    latexContent: string;
    pdfUrl: string;
}

export function ResultView() {
    const location = useLocation();
    const { latexContent, pdfUrl } = (location.state as LocationState) || {};

    if (!latexContent || !pdfUrl) {
        return (
            <div className="container py-8" style={{ textAlign: 'center' }}>
                <h2>No resume data found</h2>
                <p>Please generate a resume first.</p>
            </div>
        );
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;
        link.download = 'resume.pdf';
        link.click();
    };

    return (
        <div className="container py-8 animate-fadeIn">
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <button
                    className="btn"
                    onClick={handleDownload}
                    style={{ fontSize: '1.125rem', padding: '0.875rem 2rem' }}
                >
                    <FiDownload /> Download PDF
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1.5rem',
                height: '800px'
            }}>
                {/* LaTeX View */}
                <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '2px solid var(--gray-200)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--gray-50)'
                    }}>
                        <FiCode size={20} />
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>LaTeX Source</h3>
                    </div>
                    <div style={{
                        flex: 1,
                        overflow: 'auto',
                        padding: '1.5rem',
                        background: 'var(--gray-900)',
                        color: '#e0e0e0',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        lineHeight: '1.6'
                    }}>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                            {latexContent}
                        </pre>
                    </div>
                </div>

                {/* PDF View */}
                <div className="card" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '2px solid var(--gray-200)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--gray-50)'
                    }}>
                        <FiFileText size={20} />
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>PDF Preview</h3>
                    </div>
                    <iframe
                        src={pdfUrl}
                        style={{ flex: 1, border: 'none', width: '100%' }}
                        title="PDF Preview"
                    />
                </div>
            </div>
        </div>
    );
}
