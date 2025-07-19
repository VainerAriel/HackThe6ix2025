import { getAccessTokenSilently } from '@auth0/auth0-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ChatService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async getAuthHeaders() {
        try {
            const token = await getAccessTokenSilently();
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        } catch (error) {
            console.error('Error getting auth token:', error);
            return {
                'Content-Type': 'application/json',
            };
        }
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

    async sendMessage(conversationId, message) {
        try {
            const headers = await this.getAuthHeaders();
            const response = await fetch(`${this.baseURL}/chat/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ message }),
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

export default new ChatService(); 