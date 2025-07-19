import React, { createContext, useContext, useReducer, useEffect } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext();

const initialState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
};

const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        
        case 'SET_CONVERSATIONS':
            return { ...state, conversations: action.payload, loading: false };
        
        case 'SET_CURRENT_CONVERSATION':
            return { ...state, currentConversation: action.payload };
        
        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };
        
        case 'ADD_MESSAGE':
            return { ...state, messages: [...state.messages, action.payload] };
        
        case 'ADD_CONVERSATION':
            return { 
                ...state, 
                conversations: [action.payload, ...state.conversations] 
            };
        
        case 'REMOVE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.filter(
                    conv => conv.id !== action.payload
                ),
                currentConversation: state.currentConversation?.id === action.payload 
                    ? null 
                    : state.currentConversation
            };
        
        case 'CLEAR_CHAT':
            return {
                ...state,
                currentConversation: null,
                messages: []
            };
        
        default:
            return state;
    }
};

export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const fetchConversations = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await chatService.getConversations();
            dispatch({ type: 'SET_CONVERSATIONS', payload: response.conversations });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const createConversation = async (title = 'New Conversation') => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await chatService.createConversation(title);
            const newConversation = {
                id: response.conversation_id,
                title: response.title,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                message_count: 0
            };
            dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
            return newConversation;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    const loadConversation = async (conversationId) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await chatService.getConversation(conversationId);
            const conversation = response.conversation;
            
            dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
            dispatch({ type: 'SET_MESSAGES', payload: conversation.messages });
            dispatch({ type: 'SET_LOADING', payload: false });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const sendMessage = async (message) => {
        if (!state.currentConversation) {
            // Create new conversation if none exists
            const newConversation = await createConversation();
            dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: newConversation });
        }

        const conversationId = state.currentConversation.id;
        
        // Add user message immediately
        const userMessage = {
            content: message,
            role: 'user',
            timestamp: new Date().toISOString()
        };
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

        try {
            const response = await chatService.sendMessage(conversationId, message);
            
            // Add assistant response
            const assistantMessage = {
                content: response.response,
                role: 'assistant',
                timestamp: new Date().toISOString()
            };
            dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
            
            // Update conversation in list
            const updatedConversations = state.conversations.map(conv => 
                conv.id === conversationId 
                    ? { ...conv, updated_at: new Date().toISOString() }
                    : conv
            );
            dispatch({ type: 'SET_CONVERSATIONS', payload: updatedConversations });
            
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            await chatService.deleteConversation(conversationId);
            dispatch({ type: 'REMOVE_CONVERSATION', payload: conversationId });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
        }
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const clearChat = () => {
        dispatch({ type: 'CLEAR_CHAT' });
    };

    const value = {
        ...state,
        fetchConversations,
        createConversation,
        loadConversation,
        sendMessage,
        deleteConversation,
        clearError,
        clearChat,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}; 