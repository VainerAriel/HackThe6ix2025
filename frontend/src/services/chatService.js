import { getAccessTokenSilently } from '@auth0/auth0-react';

class ChatService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    }

    async getAuthHeaders() {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async getConversations() {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    }

    async createConversation(title = 'New Conversation') {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ title }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    }

    async getConversation(conversationId) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}`, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    async sendMessage(conversationId, message, contextWindowSize = 20) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ 
                    message,
                    context_window_size: contextWindowSize
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    async deleteConversation(conversationId) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}`, {
                method: 'DELETE',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting conversation:', error);
            throw error;
        }
    }

    async updateConversationTitle(conversationId) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/title`, {
                method: 'PUT',
                headers,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating conversation title:', error);
            throw error;
        }
    }

    async generateResponse(prompt) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/generate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ prompt }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }
}

const chatService = new ChatService();
export default chatService; 