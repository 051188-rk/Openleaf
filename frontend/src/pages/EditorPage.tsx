import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { FiDownload, FiRefreshCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { compilePreview, previewResume } from '../api';

export function EditorPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [latexContent, setLatexContent] = useState<string>('');
    const [previewImage, setPreviewImage] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [zoom, setZoom] = useState(100);
    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        // Get LaTeX content from navigation state
        const state = location.state as { latexContent?: string };
        if (state?.latexContent) {
            setLatexContent(state.latexContent);
        } else {
            // No content, redirect back
            navigate('/');
        }
    }, [location, navigate]);

    useEffect(() => {
        // Compile on initial load and whenever content changes
        if (latexContent) {
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Set new timer for debounced compilation
            debounceTimerRef.current = setTimeout(() => {
                compileLatex();
            }, 500);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [latexContent]);

    const compileLatex = async () => {
        if (!latexContent) return;

        setIsCompiling(true);
        try {
            const imageData = await compilePreview(latexContent);
            setPreviewImage(imageData);
        } catch (error) {
            console.error('Compilation error:', error);
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownload = async () => {
        try {
            const pdfUrl = await previewResume(latexContent);
            const link = document.createElement('a');
            link.href = pdfUrl.startsWith('http') ? pdfUrl : `${window.location.origin}${pdfUrl}`;
            link.download = 'resume.pdf';
            link.click();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download PDF');
        }
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

    return (
        <div className="editor-container">
            <div className="editor-toolbar">
                <div className="toolbar-left">
                    <h2 className="toolbar-title">Resume Editor</h2>
                    {isCompiling && <span className="compiling-indicator">Compiling...</span>}
                </div>
                <div className="toolbar-right">
                    <button onClick={handleZoomOut} className="toolbar-btn" title="Zoom Out">
                        <FiZoomOut />
                    </button>
                    <span className="zoom-level">{zoom}%</span>
                    <button onClick={handleZoomIn} className="toolbar-btn" title="Zoom In">
                        <FiZoomIn />
                    </button>
                    <button onClick={compileLatex} className="toolbar-btn" title="Recompile">
                        <FiRefreshCw />
                    </button>
                    <button onClick={handleDownload} className="toolbar-btn-primary" title="Download PDF">
                        <FiDownload /> Download PDF
                    </button>
                </div>
            </div>

            <Allotment defaultSizes={[50, 50]}>
                <Allotment.Pane minSize={300}>
                    <div className="editor-pane">
                        <Editor
                            height="100%"
                            defaultLanguage="latex"
                            theme="vs-dark"
                            value={latexContent}
                            onChange={(value) => setLatexContent(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                wordWrap: 'on',
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </Allotment.Pane>

                <Allotment.Pane minSize={300}>
                    <div className="preview-pane">
                        {previewImage ? (
                            <div className="preview-content" style={{ transform: `scale(${zoom / 100})` }}>
                                <img src={previewImage} alt="Resume Preview" />
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <p>Preview will appear here...</p>
                            </div>
                        )}
                    </div>
                </Allotment.Pane>
            </Allotment>
        </div>
    );
}
