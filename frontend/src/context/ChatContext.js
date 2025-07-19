import React, { createContext, useContext, useReducer, useEffect } from 'react';
import chatService from '../services/chatService';

const ChatContext = createContext();

const initialState = {
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
    contextWindowSize: 20,
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
        
        case 'UPDATE_CONVERSATION':
            return {
                ...state,
                conversations: state.conversations.map(conv => 
                    conv.id === action.payload.id ? action.payload : conv
                ),
                currentConversation: state.currentConversation?.id === action.payload.id 
                    ? action.payload 
                    : state.currentConversation
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
        
        case 'SET_CONTEXT_WINDOW_SIZE':
            return {
                ...state,
                contextWindowSize: action.payload
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

    const sendMessage = async (message, contextWindowSize = state.contextWindowSize) => {
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
            const response = await chatService.sendMessage(conversationId, message, contextWindowSize);
            
            // Add assistant response
            const assistantMessage = {
                content: response.response,
                role: 'assistant',
                timestamp: new Date().toISOString()
            };
            dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
            
            // Update conversation in list with new metadata
            const updatedConversation = {
                ...state.currentConversation,
                updated_at: new Date().toISOString(),
                message_count: state.messages.length + 2 // +2 for user and assistant messages
            };
            dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
            
            // Update context window size if provided in response
            if (response.context_window_size && response.context_window_size !== contextWindowSize) {
                dispatch({ type: 'SET_CONTEXT_WINDOW_SIZE', payload: response.context_window_size });
            }
            
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

    const updateConversationTitle = async (conversationId) => {
        try {
            const response = await chatService.updateConversationTitle(conversationId);
            if (response.success) {
                // Update the conversation in the list
                const updatedConversation = {
                    ...state.currentConversation,
                    title: response.title
                };
                dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
            }
            return response;
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message });
            throw error;
        }
    };

    const setContextWindowSize = (size) => {
        dispatch({ type: 'SET_CONTEXT_WINDOW_SIZE', payload: size });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const clearChat = () => {
        dispatch({ type: 'CLEAR_CHAT' });
    };

    // Auto-update conversation title when it has enough messages
    useEffect(() => {
        if (state.currentConversation && 
            state.messages.length >= 4 && 
            state.currentConversation.title === 'New Conversation') {
            updateConversationTitle(state.currentConversation.id);
        }
    }, [state.messages.length, state.currentConversation]);

    const value = {
        ...state,
        fetchConversations,
        createConversation,
        loadConversation,
        sendMessage,
        deleteConversation,
        updateConversationTitle,
        setContextWindowSize,
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