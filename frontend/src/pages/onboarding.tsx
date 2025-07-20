import React, { useState, useEffect } from 'react';
import RoleStep from '../components/onboarding/RoleStep';
import BossTypeStep from '../components/onboarding/BossTypeStep';
import GoalsStep from '../components/onboarding/GoalsStep';
import ConfidenceStep from '../components/onboarding/ConfidenceStep';
import ProgressBar from '../components/onboarding/ProgressBar';

// Utility function to format API responses
const formatResponse = (text: string) => {
  if (!text) return '';
  
  // Split by common section markers
  const sections = text.split(/(?=\d+\.|Overall Critique:|Score|Two Strengths:|Two Suggestions for Improvement:|Revised, More Effective Version:)/);
  
  return sections.map((section, index) => {
    const trimmedSection = section.trim();
    if (!trimmedSection) return null;
    
    // Check if this is a numbered section or heading
    const isHeading = /^\d+\.|Overall Critique:|Score|Two Strengths:|Two Suggestions for Improvement:|Revised, More Effective Version:/.test(trimmedSection);
    
    if (isHeading) {
      // Extract the heading and content
      const lines = trimmedSection.split('\n');
      const heading = lines[0];
      const content = lines.slice(1).join('\n').trim();
      
      return (
        <div key={index} className="mb-4">
          <h3 className="font-bold text-[#8b5cf6] text-lg mb-2">{heading}</h3>
          {content && (
            <div className="text-[#374151] whitespace-pre-line">
              {formatContent(content)}
            </div>
          )}
        </div>
      );
    } else {
      // Regular content
      return (
        <div key={index} className="text-[#374151] whitespace-pre-line mb-2">
          {formatContent(trimmedSection)}
        </div>
      );
    }
  }).filter(Boolean);
};

// Helper function to format content with bullet points and emphasis
const formatContent = (content: string) => {
  if (!content) return '';
  
  // Split by bullet points or numbered lists
  const lines = content.split('\n');
  
  return lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return <br key={index} />;
    
    // Check for bullet points
    if (trimmedLine.startsWith('- ')) {
      return (
        <div key={index} className="ml-4 mb-1">
          <span className="text-[#8b5cf6]">•</span> {trimmedLine.substring(2)}
        </div>
      );
    }
    
    // Check for numbered lists
    if (/^\d+\./.test(trimmedLine)) {
      return (
        <div key={index} className="ml-4 mb-1">
          <span className="font-semibold text-[#8b5cf6]">{trimmedLine}</span>
        </div>
      );
    }
    
    // Check for score pattern (e.g., "8/10 - explanation")
    if (/^\d+\/10/.test(trimmedLine)) {
      const parts = trimmedLine.split(' - ');
      if (parts.length === 2) {
        return (
          <div key={index} className="mb-2">
            <span className="font-bold text-[#8b5cf6] text-lg">{parts[0]}</span>
            <span className="text-[#374151]"> - {parts[1]}</span>
          </div>
        );
      }
    }
    
    // Regular text
    return <div key={index} className="mb-1">{trimmedLine}</div>;
  });
};

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:5000'; // <--- ADD THIS LINE

// Main App component
const App: React.FC = () => {
  // State for form data
  const [currentStep, setCurrentStep] = useState(1);
  const [role, setRole] = useState('');
  const [bossType, setBossType] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);

  // State for scenario and chat
  const [scenario, setScenario] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [critique, setCritique] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Total number of form steps
  const totalSteps = 4;

  // Function to go to the next step
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Function to go back to the previous step
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Function to get authentication headers
  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    try {
      const response = await fetch('/api/auth/token');
      const { accessToken } = await response.json();
      
      return {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error('Error getting auth token:', error);
      return {
        'Content-Type': 'application/json',
      };
    }
  };

  // Function to handle form submission and scenario generation
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Prepare profile data
      const profile = {
        role,
        boss_personality: bossType,
        goal: goals.join(', '), // Join goals into a single string
        confidence: confidence,
      };

      // Get authentication headers
      const headers = await getAuthHeaders();

      // Make API call to generate scenario
              const response = await fetch(`${API_BASE_URL}/api/chat/generate_scenario`, { // <--- MODIFIED LINE
        method: 'POST',
        headers,
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setScenario(data.scenario);
        setChatHistory([{ sender: 'AI', message: data.scenario }]);
        setCurrentStep(totalSteps + 1); // Move to chat step
      } else {
        setError(data.error || 'Failed to generate scenario.');
      }
    } catch (err: any) {
      setError(`Error generating scenario: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user response submission and critique generation
  const handleUserResponseSubmit = async () => {
    if (!userResponse.trim()) {
      setError('Please enter a response.');
      return;
    }

    setLoading(true);
    setError('');
    setChatHistory((prev) => [...prev, { sender: 'You', message: userResponse }]);
    setUserResponse(''); // Clear input after sending

    try {
      // Get authentication headers
      const headers = await getAuthHeaders();

      // Make API call to critique response
              const response = await fetch(`${API_BASE_URL}/api/chat/critique_response`, { // <--- MODIFIED LINE
        method: 'POST',
        headers,
        body: JSON.stringify({ scenario, user_input: userResponse }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setCritique(data.critique);
        setChatHistory((prev) => [...prev, { sender: 'AI', message: data.critique }]);
      } else {
        setError(data.error || 'Failed to get critique.');
      }
    } catch (err: any) {
      setError(`Error getting critique: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate step based on currentStep state
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RoleStep value={role} onChange={setRole} onNext={handleNext} />;
      case 2:
        return <BossTypeStep value={bossType} onChange={setBossType} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <GoalsStep value={goals} onChange={setGoals} onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <ConfidenceStep value={confidence} onChange={setConfidence} onNext={handleSubmit} onBack={handleBack} />;
      case totalSteps + 1: // Chat interface
        return (
          <div className="space-y-6 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-[#374151] mb-4">Your Scenario</h2>
            <div className="flex-1 overflow-y-auto border border-[#e5e7eb] rounded-lg p-6 bg-white shadow-sm min-h-[400px]">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`mb-4 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-4 rounded-lg max-w-[70%] ${
                      msg.sender === 'You' 
                        ? 'bg-[#8b5cf6] text-white' 
                        : 'bg-[#f3f4f6] text-[#374151]'
                    }`}
                  >
                    {msg.sender === 'AI' ? formatResponse(msg.message) : msg.message}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-center text-[#6b7280]">Loading...</div>
              )}
              {error && (
                <div className="text-center text-red-500">{error}</div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input
                type="text"
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type your response here..."
                className="flex-1 border border-[#e5e7eb] rounded-lg p-4 text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all text-base"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUserResponseSubmit();
                  }
                }}
              />
              <button
                onClick={handleUserResponseSubmit}
                disabled={loading || !userResponse.trim()}
                className={`px-6 py-4 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white
                  ${userResponse.trim() && !loading ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
              >
                Send
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-[#e5e7eb]">
        {currentStep <= totalSteps && <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />}
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default App;

