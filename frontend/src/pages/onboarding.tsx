import React, { useState } from 'react';
import ProgressBar from '../components/onboarding/ProgressBar';
import ChatBubble from '../components/chat/ChatBubble';

// Define the comprehensive question sets
const SCENARIO_TYPES = [
  { value: 'salary_negotiation', label: 'Asking for a raise or promotion', description: 'Practice salary discussions and career advancement conversations' },
  { value: 'difficult_feedback', label: 'Giving tough feedback to a colleague/subordinate', description: 'Learn to deliver constructive criticism professionally' },
  { value: 'boundary_setting', label: 'Setting boundaries with demanding requests', description: 'Practice saying no professionally and managing workload' },
  { value: 'conflict_resolution', label: 'Resolving workplace conflict', description: 'Navigate disagreements and tensions with coworkers' },
  { value: 'idea_pitching', label: 'Pitching a new idea or project', description: 'Present proposals and get buy-in from stakeholders' },
  { value: 'performance_discussion', label: 'Discussing poor performance (yours or theirs)', description: 'Address performance issues constructively' },
  { value: 'resource_request', label: 'Requesting resources, budget, or support', description: 'Make compelling cases for what your team needs' }
];

const RELATIONSHIPS = [
  { value: 'direct_manager', label: 'Your direct manager/boss' },
  { value: 'senior_leadership', label: 'Senior leadership (VP, C-suite)' },
  { value: 'peer_colleague', label: 'Peer/colleague at your level' },
  { value: 'team_member', label: 'Someone on your team' },
  { value: 'cross_functional', label: 'Someone from another department' },
  { value: 'client_external', label: 'External client or stakeholder' }
];

const COMMUNICATION_STYLES = [
  { value: 'supportive_collaborative', label: 'Supportive & Collaborative', description: 'Listens well, asks questions, generally encouraging' },
  { value: 'direct_no_nonsense', label: 'Direct & No-Nonsense', description: 'Gets straight to the point, values efficiency over rapport' },
  { value: 'skeptical_analytical', label: 'Skeptical & Analytical', description: 'Questions everything, wants data and proof points' },
  { value: 'busy_impatient', label: 'Busy & Impatient', description: 'Always rushing, interrupts, hard to get their attention' },
  { value: 'defensive_territorial', label: 'Defensive & Territorial', description: 'Protective of their domain, resistant to change' },
  { value: 'unpredictable_moody', label: 'Unpredictable & Moody', description: 'Hard to read, reactions vary depending on their mood' }
];

const JOB_LEVELS = [
  { value: 'individual_contributor', label: 'Individual Contributor (0-2 years)' },
  { value: 'senior_contributor', label: 'Senior Contributor (3-5 years)' },
  { value: 'team_lead', label: 'Team Lead/Project Manager' },
  { value: 'middle_management', label: 'Manager/Director' },
  { value: 'senior_management', label: 'Senior Manager/VP' }
];

const INDUSTRIES = [
  { value: 'tech', label: 'Technology/Software' },
  { value: 'finance', label: 'Finance/Banking' },
  { value: 'healthcare', label: 'Healthcare/Medical' },
  { value: 'consulting', label: 'Consulting/Professional Services' },
  { value: 'retail', label: 'Retail/E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing/Industrial' },
  { value: 'nonprofit', label: 'Non-profit/Government' },
  { value: 'other', label: 'Other' }
];

const CHALLENGE_LEVELS = [
  { value: 'low', label: 'Low Challenge', description: 'Straightforward ask, supportive environment' },
  { value: 'medium', label: 'Medium Challenge', description: 'Some pushback expected, need to make a case' },
  { value: 'high', label: 'High Challenge', description: 'Significant resistance expected, high stakes' }
];

const TIME_CONSTRAINTS = [
  { value: 'immediate', label: 'This week (urgent)' },
  { value: 'soon', label: 'Next few weeks' },
  { value: 'flexible', label: 'Flexible timeline' }
];

const STAKES_LEVELS = [
  { value: 'low_stakes', label: 'Low Stakes', description: 'Minor inconvenience, can try again later' },
  { value: 'medium_stakes', label: 'Medium Stakes', description: 'Could impact your projects or team morale' },
  { value: 'high_stakes', label: 'High Stakes', description: 'Could significantly impact your career or job satisfaction' }
];

const PERSONAL_STYLES = [
  { value: 'direct_confident', label: 'Direct and confident' },
  { value: 'collaborative_consensus', label: 'Collaborative, seeking consensus' },
  { value: 'cautious_diplomatic', label: 'Cautious and diplomatic' },
  { value: 'emotional_passionate', label: 'Emotional and passionate' },
  { value: 'analytical_data_driven', label: 'Analytical and data-driven' }
];

const PAST_EXPERIENCES = [
  { value: 'generally_positive', label: 'Generally positive outcomes' },
  { value: 'mixed_results', label: 'Mixed results' },
  { value: 'usually_struggle', label: 'I usually struggle with these conversations' },
  { value: 'first_time', label: 'This is my first time having this type of conversation' }
];

// Define your backend API base URL
const API_BASE_URL = 'http://localhost:5000';

// Main Onboarding component
const Onboarding: React.FC = () => {
  // State for form data
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    scenario_type: '',
    relationship: '',
    communication_style: '',
    job_level: '',
    industry: '',
    specific_goal: '',
    challenge_level: '',
    time_constraint: '',
    stakes: '',
    personal_style: '',
    past_experience: ''
  });

  // State for roleplay
  const [roleplayContext, setRoleplayContext] = useState('');
  const [conversationHistory, setConversationHistory] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionComplete, setSessionComplete] = useState(false);
  const [finalCritique, setFinalCritique] = useState('');

  // Total number of form steps
  const totalSteps = 11;

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

  // Function to update form data
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Function to go to the next step
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Function to go back to the previous step
  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Function to start roleplay
  const handleStartRoleplay = async () => {
    setLoading(true);
    setError('');
    
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/chat/start_roleplay`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRoleplayContext(data.roleplay_prompt);
        setConversationHistory([{ role: 'assistant', content: data.scenario_and_response }]);
        setCurrentStep(totalSteps + 1); // Move to roleplay step
      } else {
        setError(data.error || 'Failed to start roleplay.');
      }
    } catch (err: any) {
      setError(`Error starting roleplay: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to continue roleplay
  const handleContinueRoleplay = async () => {
    if (!userInput.trim()) {
      setError('Please enter a response.');
      return;
    }

    setLoading(true);
    setError('');
    
    // Add user message to history
    const updatedHistory = [...conversationHistory, { role: 'user', content: userInput }];
    setConversationHistory(updatedHistory);
    setUserInput('');

    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/chat/continue_roleplay`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          roleplay_context: roleplayContext,
          conversation_history: updatedHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setConversationHistory([...updatedHistory, { role: 'assistant', content: data.response }]);
      } else {
        setError(data.error || 'Failed to continue roleplay.');
      }
    } catch (err: any) {
      setError(`Error continuing roleplay: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to end roleplay and get critique
  const handleEndRoleplay = async () => {
    setLoading(true);
    setError('');
    
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/api/chat/end_roleplay`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          profile: formData,
          conversation_history: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setFinalCritique(data.critique);
        setSessionComplete(true);
        setCurrentStep(totalSteps + 2); // Move to results step
      } else {
        setError(data.error || 'Failed to get critique.');
      }
    } catch (err: any) {
      setError(`Error getting critique: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Render form step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">What conversation do you need to practice?</h2>
            <p className="text-[#6b7280]">Choose the type of workplace conversation you want to practice.</p>
            <div className="space-y-4">
              {SCENARIO_TYPES.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.scenario_type === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('scenario_type', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                  <p className="text-sm text-[#6b7280] mt-1">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">Who are you talking to?</h2>
            <p className="text-[#6b7280]">Select the person you'll be having this conversation with.</p>
            <div className="space-y-4">
              {RELATIONSHIPS.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.relationship === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('relationship', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">How does this person typically communicate?</h2>
            <p className="text-[#6b7280]">Understanding their communication style will help create a realistic scenario.</p>
            <div className="space-y-4">
              {COMMUNICATION_STYLES.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.communication_style === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('communication_style', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                  <p className="text-sm text-[#6b7280] mt-1">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">What's your role level?</h2>
            <p className="text-[#6b7280]">This helps us understand your experience and authority level.</p>
            <div className="space-y-4">
              {JOB_LEVELS.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.job_level === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('job_level', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">What industry are you in?</h2>
            <p className="text-[#6b7280]">This provides context for the conversation.</p>
            <div className="space-y-4">
              {INDUSTRIES.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.industry === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('industry', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">What exactly do you want to achieve?</h2>
            <p className="text-[#6b7280]">Be specific about your goal for this conversation.</p>
            <textarea
              value={formData.specific_goal}
              onChange={(e) => updateFormData('specific_goal', e.target.value)}
              placeholder="e.g., Get approval for hiring 2 new team members, or Ask for 15% salary increase based on recent project success"
              className="w-full p-4 border border-[#e5e7eb] rounded-lg text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all text-base min-h-[120px]"
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">How difficult do you expect this conversation to be?</h2>
            <p className="text-[#6b7280]">This helps us set the right challenge level for your practice.</p>
            <div className="space-y-4">
              {CHALLENGE_LEVELS.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.challenge_level === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('challenge_level', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                  <p className="text-sm text-[#6b7280] mt-1">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">When does this conversation need to happen?</h2>
            <p className="text-[#6b7280]">This affects the urgency and pressure in the scenario.</p>
            <div className="space-y-4">
              {TIME_CONSTRAINTS.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.time_constraint === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('time_constraint', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">What happens if this doesn't go well?</h2>
            <p className="text-[#6b7280]">Understanding the stakes helps create appropriate pressure.</p>
            <div className="space-y-4">
              {STAKES_LEVELS.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.stakes === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('stakes', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                  <p className="text-sm text-[#6b7280] mt-1">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">How do you naturally approach difficult conversations?</h2>
            <p className="text-[#6b7280]">This helps us understand your communication style.</p>
            <div className="space-y-4">
              {PERSONAL_STYLES.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.personal_style === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('personal_style', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#374151]">How have similar conversations gone for you before?</h2>
            <p className="text-[#6b7280]">This helps us tailor the practice to your experience level.</p>
            <div className="space-y-4">
              {PAST_EXPERIENCES.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.past_experience === option.value
                      ? 'border-[#8b5cf6] bg-[#f3f4f6]'
                      : 'border-[#e5e7eb] hover:border-[#8b5cf6]'
                  }`}
                  onClick={() => updateFormData('past_experience', option.value)}
                >
                  <h3 className="font-semibold text-[#374151]">{option.label}</h3>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render roleplay interface
  const renderRoleplay = () => (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#374151]">Roleplay Practice</h2>
        <button
          onClick={handleEndRoleplay}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Ending...' : 'End Session & Get Feedback'}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto border border-[#e5e7eb] rounded-lg p-6 bg-white shadow-sm min-h-[400px]">
        {conversationHistory.map((msg, index) => (
          <div key={index} className="mb-4">
            <ChatBubble 
              sender={msg.role === 'user' ? 'user' : 'ai'} 
              text={msg.content} 
            />
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
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response here..."
          className="flex-1 border border-[#e5e7eb] rounded-lg p-4 text-[#374151] placeholder-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all text-base"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleContinueRoleplay();
            }
          }}
        />
        <button
          onClick={handleContinueRoleplay}
          disabled={loading || !userInput.trim()}
          className={`px-6 py-4 rounded-lg font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:ring-offset-2 focus:ring-offset-white
            ${userInput.trim() && !loading ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]' : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'}`}
        >
          Send
        </button>
      </div>
    </div>
  );

  // Render results
  const renderResults = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#374151]">Session Complete!</h2>
      <p className="text-[#6b7280]">Here's your comprehensive feedback:</p>
      
      <div className="border border-[#e5e7eb] rounded-lg p-6 bg-white shadow-sm">
        <ChatBubble sender="ai" text={finalCritique} />
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => {
            setCurrentStep(1);
            setFormData({
              scenario_type: '',
              relationship: '',
              communication_style: '',
              job_level: '',
              industry: '',
              specific_goal: '',
              challenge_level: '',
              time_constraint: '',
              stakes: '',
              personal_style: '',
              past_experience: ''
            });
            setConversationHistory([]);
            setRoleplayContext('');
            setSessionComplete(false);
            setFinalCritique('');
          }}
          className="px-6 py-3 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed]"
        >
          Practice Another Scenario
        </button>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="px-6 py-3 border border-[#8b5cf6] text-[#8b5cf6] rounded-lg hover:bg-[#8b5cf6] hover:text-white"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  // Render the appropriate step
  const renderStep = () => {
    if (currentStep <= totalSteps) {
      return renderFormStep();
    } else if (currentStep === totalSteps + 1) {
      return renderRoleplay();
    } else if (currentStep === totalSteps + 2) {
      return renderResults();
    }
    return null;
  };

  // Check if current step is complete
  const isStepComplete = () => {
    if (currentStep <= totalSteps) {
      const field = Object.keys(formData)[currentStep - 1];
      return formData[field as keyof typeof formData] !== '';
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl border border-[#e5e7eb]">
        {currentStep <= totalSteps && (
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        )}
        
        <div className="mt-8">
          {renderStep()}
        </div>
        
        {currentStep <= totalSteps && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                  : 'border border-[#8b5cf6] text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white'
              }`}
            >
              Back
            </button>
            
            {currentStep === totalSteps ? (
              <button
                onClick={handleStartRoleplay}
                disabled={loading || !isStepComplete()}
                className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                  isStepComplete() && !loading
                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]'
                    : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                {loading ? 'Starting...' : 'Start Roleplay'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 ${
                  isStepComplete()
                    ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white hover:from-[#7c3aed] hover:to-[#9333ea]'
                    : 'bg-[#f3f4f6] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

