# HackThe6ix 2025

A modern web application built with Flask, React, MongoDB, Auth0, and Google's Gemini API for intelligent chat interactions.

## 🚀 Features

- **Authentication**: Secure user authentication with Auth0
- **AI Chat**: Intelligent conversations powered by Google's Gemini API
- **Real-time Messaging**: Interactive chat interface with message history
- **User Management**: User profiles and conversation management
- **Modern UI**: Beautiful, responsive design with React
- **Scalable Backend**: Modular Flask architecture with MongoDB

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework
- **MongoDB**: NoSQL database for data persistence
- **Auth0**: Authentication and authorization
- **Google Gemini API**: AI-powered chat responses
- **PyMongo**: MongoDB driver for Python

### Frontend
- **React**: JavaScript library for building user interfaces
- **Auth0 React SDK**: Authentication integration
- **CSS3**: Modern styling with responsive design
- **Context API**: State management

## 📁 Project Structure

```
HackThe6ix2025/
├── backend/                          # Flask backend
│   ├── app/
│   │   ├── models/                  # MongoDB models
│   │   ├── routes/                  # API routes
│   │   ├── services/                # Business logic
│   │   ├── middleware/              # Auth middleware
│   │   └── utils/                   # Helper functions
│   ├── tests/                       # Backend tests
│   ├── requirements.txt             # Python dependencies
│   └── run.py                       # Application entry point
├── frontend/                        # React frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── services/                # API services
│   │   ├── context/                 # React context
│   │   └── hooks/                   # Custom hooks
│   └── package.json                 # Node dependencies
├── docs/                            # Documentation
├── scripts/                         # Build/deployment scripts
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)
- Auth0 account
- Google Cloud account (for Gemini API)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HackThe6ix2025
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Backend (`.env` in `backend/` directory):
   ```env
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_API_AUDIENCE=your-api-audience
   MONGODB_URI=mongodb://localhost:27017/hackthe6ix
   GEMINI_API_KEY=your-gemini-api-key
   FLASK_SECRET_KEY=your-secret-key
   FLASK_ENV=development
   ```

   Frontend (`.env` in `frontend/` directory):
   ```env
   REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your-client-id
   REACT_APP_AUTH0_AUDIENCE=your-api-audience
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints
- `GET /api/auth/public` - Public endpoint
- `GET /api/auth/protected` - Protected endpoint
- `GET /api/auth/profile` - Get user profile

### Chat Endpoints
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/{id}` - Get specific conversation
- `POST /api/chat/conversations/{id}/messages` - Send message
- `DELETE /api/chat/conversations/{id}` - Delete conversation
- `POST /api/chat/generate` - Generate single response

### User Endpoints
- `POST /api/user/data` - Post user data
- `GET /api/user/health` - Health check

## 🔧 Development

### Backend Development
```bash
cd backend
python run.py
```

### Frontend Development
```bash
cd frontend
npm start
```

### Running Tests
```bash
npm run test:backend    # Backend tests
npm run test:frontend   # Frontend tests
```

### Building for Production
```bash
npm run build:frontend
```

## 📖 Detailed Setup Guide

For detailed setup instructions, including MongoDB, Auth0, and Gemini API configuration, see [docs/setup.md](docs/setup.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 HackThe6ix 2025

This project was created for HackThe6ix 2025 hackathon. It demonstrates modern web development practices with a focus on AI integration and user experience.

## 🙏 Acknowledgments

- Auth0 for authentication services
- Google for Gemini AI API
- MongoDB for database services
- The React and Flask communities 