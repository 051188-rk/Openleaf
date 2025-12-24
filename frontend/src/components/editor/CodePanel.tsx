import Editor from '@monaco-editor/react';

interface CodePanelProps {
    fileName: string;
    content: string;
    onChange: (value: string) => void;
}

export function CodePanel({ fileName, content, onChange }: CodePanelProps) {
    return (
        <div className="code-panel">
            <div className="code-panel-header">
                <span className="file-name">{fileName}</span>
            </div>
            <div className="code-panel-editor">
                <Editor
                    height="100%"
                    defaultLanguage="latex"
                    theme="vs-dark"
                    value={content}
                    onChange={(value) => onChange(value || '')}
                    options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        automaticLayout: true,
                        fontFamily: "'Cascadia Code', 'Consolas', 'Monaco', monospace",
                        padding: { top: 16, bottom: 16 },
                        lineHeight: 22,
                    }}
                />
            </div>
        </div>
    );
}
