import { useState, type KeyboardEvent } from 'react';
import { FiSend, FiMessageSquare } from 'react-icons/fi';

interface ChatPanelProps {
    onSendMessage: (message: string) => void;
    isProcessing: boolean;
}

interface Message {
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function ChatPanel({ onSendMessage, isProcessing }: ChatPanelProps) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const handleSend = () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            type: 'user',
            content: input,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        onSendMessage(input);
        setInput('');
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="chat-panel">
            <div className="chat-panel-header">
                <FiMessageSquare size={16} />
                <span>AI Assistant</span>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <FiMessageSquare size={32} />
                        <p>Ask the AI to edit your resume</p>
                        <small>Example: "Make the skills section more concise"</small>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`chat-message ${msg.type}`}>
                            <div className="message-content">{msg.content}</div>
                        </div>
                    ))
                )}
                {isProcessing && (
                    <div className="chat-message assistant">
                        <div className="message-content typing">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Ask AI to edit your resume..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isProcessing}
                />
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!input.trim() || isProcessing}
                >
                    <FiSend size={18} />
                </button>
            </div>
        </div>
    );
}
