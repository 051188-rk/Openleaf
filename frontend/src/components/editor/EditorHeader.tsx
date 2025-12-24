import { FiMenu, FiDownload, FiShare2, FiZap, FiCode, FiEye } from 'react-icons/fi';

interface EditorHeaderProps {
    activeView: 'code' | 'visual';
    onViewChange: (view: 'code' | 'visual') => void;
    onRecompile: () => void;
    onDownload: () => void;
    isCompiling: boolean;
}

export function EditorHeader({
    activeView,
    onViewChange,
    onRecompile,
    onDownload,
    isCompiling
}: EditorHeaderProps) {
    return (
        <div className="editor-header">
            <div className="editor-header-left">
                <button className="menu-btn">
                    <FiMenu size={20} />
                </button>
                <div className="project-name">
                    <span>dev_neww</span>
                </div>
                <div className="editor-tabs">
                    <button
                        className={`tab-btn ${activeView === 'code' ? 'active' : ''}`}
                        onClick={() => onViewChange('code')}
                    >
                        <FiCode size={16} />
                        Code Editor
                    </button>
                    <button
                        className={`tab-btn ${activeView === 'visual' ? 'active' : ''}`}
                        onClick={() => onViewChange('visual')}
                    >
                        <FiEye size={16} />
                        Visual Editor
                    </button>
                </div>
            </div>

            <div className="editor-header-right">
                <button
                    className="header-btn"
                    onClick={onRecompile}
                    disabled={isCompiling}
                >
                    {isCompiling ? 'Compiling...' : 'Recompile'}
                </button>
                <button className="header-btn" onClick={onDownload}>
                    <FiDownload size={16} />
                    Download
                </button>
                <button className="header-btn">
                    <FiShare2 size={16} />
                    Share
                </button>
                <button className="header-btn-primary">
                    <FiZap size={16} />
                    Upgrade
                </button>
            </div>
        </div>
    );
}
