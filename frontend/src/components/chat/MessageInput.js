import React from 'react';
import './MessageInput.css';

const MessageInput = ({ 
    value, 
    onChange, 
    onSend, 
    onKeyPress, 
    disabled, 
    placeholder 
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() && !disabled) {
            onSend(value);
        }
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <div className="input-container">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={onKeyPress}
                    disabled={disabled}
                    placeholder={placeholder}
                    rows="1"
                    className="message-textarea"
                />
                <button
                    type="submit"
                    disabled={!value.trim() || disabled}
                    className="send-button"
                >
                    {disabled ? (
                        <span className="loading-spinner">⏳</span>
                    ) : (
                        <span>➤</span>
                    )}
                </button>
            </div>
        </form>
    );
};

export default MessageInput; 