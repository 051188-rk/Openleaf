import { useEffect, useRef } from 'react';

interface PDFPreviewProps {
    pdfData: string | null;
    isCompiling: boolean;
    error: string | null;
}

export function PDFPreview({ pdfData, isCompiling, error }: PDFPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (pdfData && iframeRef.current) {
            // Update iframe src with new PDF data
            iframeRef.current.src = pdfData;
        }
    }, [pdfData]);

    return (
        <div className="pdf-preview">
            <div className="pdf-preview-header">
                <span>PDF Preview</span>
                {isCompiling && <span className="compiling-badge">Compiling...</span>}
            </div>
            <div className="pdf-preview-content">
                {error ? (
                    <div className="pdf-error">
                        <h3>Compilation Error</h3>
                        <pre>{error}</pre>
                    </div>
                ) : pdfData ? (
                    <iframe
                        ref={iframeRef}
                        src={pdfData}
                        title="PDF Preview"
                        className="pdf-iframe"
                    />
                ) : (
                    <div className="pdf-placeholder">
                        <p>Compiling your document...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
