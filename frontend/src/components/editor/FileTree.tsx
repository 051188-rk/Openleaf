import { FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
}

interface FileTreeProps {
    activeFile: string;
    onFileSelect: (fileName: string) => void;
}

export function FileTree({ activeFile, onFileSelect }: FileTreeProps) {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(['root']));

    const files: FileNode = {
        name: 'root',
        type: 'folder',
        children: [
            { name: 'resume.tex', type: 'file' },
            { name: 'resume.cls', type: 'file' },
        ]
    };

    const toggleFolder = (name: string) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(name)) {
            newExpanded.delete(name);
        } else {
            newExpanded.add(name);
        }
        setExpanded(newExpanded);
    };

    const renderNode = (node: FileNode, depth: number = 0) => {
        if (node.type === 'folder') {
            const isExpanded = expanded.has(node.name);
            return (
                <div key={node.name}>
                    {node.name !== 'root' && (
                        <div
                            className="file-tree-item folder"
                            style={{ paddingLeft: `${depth * 16 + 8}px` }}
                            onClick={() => toggleFolder(node.name)}
                        >
                            {isExpanded ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
                            <span>{node.name}</span>
                        </div>
                    )}
                    {isExpanded && node.children && (
                        <div>
                            {node.children.map(child => renderNode(child, depth + 1))}
                        </div>
                    )}
                </div>
            );
        } else {
            const isActive = activeFile === node.name;
            return (
                <div
                    key={node.name}
                    className={`file-tree-item file ${isActive ? 'active' : ''}`}
                    style={{ paddingLeft: `${depth * 16 + 24}px` }}
                    onClick={() => onFileSelect(node.name)}
                >
                    <FiFile size={14} />
                    <span>{node.name}</span>
                </div>
            );
        }
    };

    return (
        <div className="file-tree">
            <div className="file-tree-header">
                <span>File tree</span>
            </div>
            <div className="file-tree-content">
                {renderNode(files)}
            </div>
        </div>
    );
}
