import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { EditorHeader } from '../components/editor/EditorHeader';
import { FileTree } from '../components/editor/FileTree';
import { CodePanel } from '../components/editor/CodePanel';
import { PDFPreview } from '../components/editor/PDFPreview';
import { ChatPanel } from '../components/editor/ChatPanel';
import { compilePDFBase64, chatEdit } from '../api';

export function EditorPage() {
    const location = useLocation();

    // State management
    const [activeView, setActiveView] = useState<'code' | 'visual'>('code');
    const [activeFile, setActiveFile] = useState('resume.tex');
    const [latexContent, setLatexContent] = useState<string>('');
    const [pdfData, setPdfData] = useState<string | null>(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [compilationError, setCompilationError] = useState<string | null>(null);
    const [isChatProcessing, setIsChatProcessing] = useState(false);

    const debounceTimerRef = useRef<number | null>(null);

    useEffect(() => {
        // Get LaTeX content from navigation state
        const state = location.state as { latexContent?: string };
        if (state?.latexContent) {
            setLatexContent(state.latexContent);
        } else {
            // Default template if no content provided
            setLatexContent(`\\documentclass{resume}
\\usepackage[left=0.4 in,top=0.4 in,right=0.4 in,bottom=0.4 in]{geometry}
\\name{Rakesh Kumar Barik}
\\address{+91 9937122417}
\\address{LinkedIn \\\\ GitHub \\\\ LeetCode \\\\ CodeChef}

\\begin{document}

\\begin{rSection}{Education}

{\\bf B.Tech in Computer Science \\& Engineering}, Raj Niwash University of Technology (RJUT), Roorkela
\\hfill {Nov 2022 - June 2026}

CGPA: 8.27

\\end{rSection}

% SKILLS SECTION
\\begin{rSection}{SKILLS}

\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }
Programming Languages & C, C++, Java, Python, JavaScript, TypeScript
\\\\
Software Engineering \\& Automation & SDLC, Agile, DevOps, TDD, CI/CD, etc.
\\\\
DevOps \\& Cloud & GitHub Actions, Kubernetes, AWS (EC2), Git, Linux
\\\\
Database & SQL, MongoDB, MySQL, PostgreSQL, SQLite
\\end{tabular}

\\end{rSection}

\\end{document}`);
        }
    }, [location]);

    useEffect(() => {
        // Compile on initial load and whenever content changes
        if (latexContent) {
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Set new timer for debounced compilation
            debounceTimerRef.current = window.setTimeout(() => {
                compileLatex();
            }, 1000);
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
        setCompilationError(null);

        try {
            const result = await compilePDFBase64(latexContent);

            if (result.success && result.pdf) {
                setPdfData(result.pdf);
            } else {
                setCompilationError(result.error || 'Unknown compilation error');
            }
        } catch (error) {
            console.error('Compilation error:', error);
            setCompilationError('Failed to compile LaTeX. Please check your code.');
        } finally {
            setIsCompiling(false);
        }
    };

    const handleDownload = () => {
        if (pdfData) {
            // Convert base64 to blob and download
            const base64Data = pdfData.split(',')[1];
            const binaryData = atob(base64Data);
            const arrayBuffer = new ArrayBuffer(binaryData.length);
            const uint8Array = new Uint8Array(arrayBuffer);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleChatMessage = async (message: string) => {
        setIsChatProcessing(true);

        try {
            const result = await chatEdit(message, latexContent);

            if (result.success) {
                setLatexContent(result.latex_content);
            } else {
                console.error('Chat edit error:', result.error);
                alert('Failed to process your request: ' + result.error);
            }
        } catch (error) {
            console.error('Chat error:', error);
            alert('Failed to process your request. Please try again.');
        } finally {
            setIsChatProcessing(false);
        }
    };

    return (
        <div className="editor-page">
            <EditorHeader
                activeView={activeView}
                onViewChange={setActiveView}
                onRecompile={compileLatex}
                onDownload={handleDownload}
                isCompiling={isCompiling}
            />

            <div className="editor-layout">
                <Allotment defaultSizes={[200, 400, 350, 250]}>
                    {/* File Tree */}
                    <Allotment.Pane minSize={150} maxSize={300}>
                        <FileTree
                            activeFile={activeFile}
                            onFileSelect={setActiveFile}
                        />
                    </Allotment.Pane>

                    {/* Code Editor */}
                    <Allotment.Pane minSize={300}>
                        <CodePanel
                            fileName={activeFile}
                            content={latexContent}
                            onChange={setLatexContent}
                        />
                    </Allotment.Pane>

                    {/* PDF Preview */}
                    <Allotment.Pane minSize={300}>
                        <PDFPreview
                            pdfData={pdfData}
                            isCompiling={isCompiling}
                            error={compilationError}
                        />
                    </Allotment.Pane>

                    {/* AI Chat Panel */}
                    <Allotment.Pane minSize={200} maxSize={400}>
                        <ChatPanel
                            onSendMessage={handleChatMessage}
                            isProcessing={isChatProcessing}
                        />
                    </Allotment.Pane>
                </Allotment>
            </div>
        </div>
    );
}
