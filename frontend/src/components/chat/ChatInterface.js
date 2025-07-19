import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatInterface.css';

const ChatInterface = () => {
    const { 
        messages, 
        loading, 
        error, 
        sendMessage, 
        clearError,
        currentConversation 
    } = useChat();

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        // Clear error after 5 seconds
        if (error) {
            const timer = setTimeout(() => {
                clearError();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, clearError]);

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;
        
        setInputValue('');
        await sendMessage(message);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(inputValue);
        }
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h2>AI Chat Assistant</h2>
                {currentConversation && (
                    <span className="conversation-title">
                        {currentConversation.title}
                    </span>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={clearError} className="error-close">
                        ×
                    </button>
                </div>
            )}

            <div className="chat-messages">
                <MessageList messages={messages} loading={loading} />
            </div>

            <div className="chat-input">
                <MessageInput
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSendMessage}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    placeholder="Type your message..."
                />
            </div>
        </div>
    );
};

export default ChatInterface; 