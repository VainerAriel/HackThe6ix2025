import React, { useRef, useEffect } from 'react';
import './MessageList.css';

const MessageList = ({ messages, loading }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="message-list">
            {messages.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">💬</div>
                    <h3>Start a conversation</h3>
                    <p>Send a message to begin chatting with the AI assistant.</p>
                </div>
            )}

            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                    <div className="message-content">
                        <div className="message-text">
                            {message.content}
                        </div>
                        <div className="message-time">
                            {formatTime(message.timestamp)}
                        </div>
                    </div>
                    <div className="message-avatar">
                        {message.role === 'user' ? '👤' : '🤖'}
                    </div>
                </div>
            ))}

            {loading && (
                <div className="message assistant-message">
                    <div className="message-content">
                        <div className="message-text">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                    <div className="message-avatar">🤖</div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList; 