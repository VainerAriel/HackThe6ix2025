# PitchPerfect 🎯

**AI-Powered Workplace Communication Training Platform**

PitchPerfect is an intelligent web application that helps professionals practice and improve their workplace communication skills through AI-powered roleplay scenarios. Using Google's Gemini AI, users can engage in realistic workplace conversations and receive personalized feedback to enhance their communication effectiveness.

## ✨ Features

- **🤖 AI-Powered Roleplay** - Realistic workplace scenarios with intelligent AI characters
- **📊 Comprehensive Feedback** - Detailed analysis and coaching after each session
- **🎯 Personalized Training** - 11-step onboarding to customize scenarios to your needs
- **🔐 Secure Authentication** - Auth0-powered user management
- **📱 Responsive Design** - Beautiful, modern UI that works on all devices
- **💾 Session History** - Track your progress and review past conversations

## 🛠️ Tech Stack

### Frontend
- **React** - User interface library
- **Next.js** - React framework with SSR
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Flask** - Python web framework
- **MongoDB** - NoSQL database
- **Auth0** - Authentication service
- **Google Gemini API** - AI language model

### Infrastructure
- **Python** - Backend programming
- **Node.js** - JavaScript runtime

## 📁 Project Structure

```
HackThe6ix2025/
├── frontend/                    # Next.js React application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── chat/          # Chat interface components
│   │   │   └── onboarding/    # Onboarding flow components
│   │   ├── pages/             # Next.js pages and API routes
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   └── styles/            # Global styles
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
├── backend/                    # Flask Python application
│   ├── app/
│   │   ├── models/            # Database models
│   │   ├── routes/            # API endpoints
│   │   ├── services/          # Business logic
│   │   └── middleware/        # Authentication middleware
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Application entry point
├── scripts/                    # Setup and deployment scripts
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and **npm 8+**
- **Python 3.8+** and **pip**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/VainerAriel/HackThe6ix2025.git
cd HackThe6ix2025
```

### 2. One-Click Setup (Windows)

Run the setup script to install all dependencies:

```powershell
.\scripts\setup.ps1
```

**OR** skip setup and let the start script handle it automatically:

```powershell
.\scripts\start-dev.ps1
```

### 3. Manual Setup

#### Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

#### Environment Configuration

Create `.env` files with your API keys:

**Backend** (`backend/.env`):
```env
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pitchperfect
GEMINI_API_KEY=your-gemini-api-key
FLASK_SECRET_KEY=your-secret-key
FLASK_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_AUTH0_SECRET=your-auth0-secret
NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
NEXT_PUBLIC_AUTH0_BASE_URL=http://localhost:3000
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start Development Servers

#### Option A: One-Click Start (Windows)

```powershell
.\scripts\start-dev.ps1
```

*Note: This script will automatically install dependencies if they're missing.*

#### Option B: Manual Start

```bash
# Terminal 1: Start backend
cd backend
python run.py

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start both servers
npm run dev

# Build for production
npm run build:frontend

# Run tests
npm run test:backend
npm run test:frontend

# Lint code
npm run lint:frontend
```

### API Endpoints

- `POST /api/chat/start_roleplay` - Start AI roleplay session
- `POST /api/chat/continue_roleplay` - Continue conversation
- `POST /api/chat/end_roleplay` - End session and get feedback
- `POST /api/auth/sync` - Sync user data with database

## 🎯 How It Works

1. **Onboarding** - Complete 11-step questionnaire to customize your scenario
2. **Roleplay** - Engage in realistic workplace conversations with AI characters
3. **Feedback** - Receive comprehensive analysis and coaching tips
4. **Practice** - Repeat and improve your communication skills

👥 Team
Created for HackThe6ix 2025 by:

- Ashmaan Sohail - Incoming 2nd Year Computer Engineering @ Queen's University
- Ariel Vainer - Incoming 2nd Year Computer Science @ University of Waterloo
- Brody Honigman Deltoff - Incoming 2nd Year Computer Science @ University of Toronto

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🏆 HackThe6ix 2025

Built for HackThe6ix 2025 hackathon - demonstrating modern AI integration in workplace training applications.

---

**Ready to perfect your pitch?** 🚀 Start your communication training journey today! 
