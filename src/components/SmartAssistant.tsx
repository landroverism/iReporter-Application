import React, { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';

interface SmartAssistantProps {
  onSuggestion: (suggestion: {
    category: 'red-flag' | 'intervention';
    type: string;
    title: string;
    description: string;
  }) => void;
}

export function SmartAssistant({ onSuggestion }: SmartAssistantProps) {
  const [userInput, setUserInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const analyzeReport = useAction(api.ai.analyzeReportContent);
  const chatWithAssistant = useAction(api.ai.chatWithAssistant);

  const handleAnalyze = async () => {
    if (!userInput.trim()) {
      toast.error('Please describe your issue first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeReport({ description: userInput });
      
      if (result.category && result.type) {
        onSuggestion({
          category: result.category as 'red-flag' | 'intervention',
          type: result.type,
          title: result.suggestedTitle || '',
          description: result.improvedDescription || userInput,
        });
      }
    } catch (error) {
      console.error('Error analyzing report:', error);
      toast.error('Failed to analyze report. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleChat = async () => {
    if (!userInput.trim()) return;

    const newMessage = { role: 'user' as const, content: userInput };
    setChatHistory(prev => [...prev, newMessage]);
    
    try {
      const response = await chatWithAssistant({ 
        message: userInput,
        chatHistory: chatHistory 
      });
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: response.message }]);
      setUserInput('');
    } catch (error) {
      console.error('Error chatting with assistant:', error);
      toast.error('Failed to get response from assistant');
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserInput(prev => prev + ' ' + transcript);
      toast.success('Voice input captured');
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error('Voice input failed. Please try again.');
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="text-2xl">🤖</div>
        <h3 className="text-lg font-semibold text-gray-800">Smart Assistant</h3>
        <div className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
          AI-Powered
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Describe your issue and I'll help categorize it and suggest improvements to your report.
      </p>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="bg-white rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
          {chatHistory.map((message, index) => (
            <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded-lg text-sm ${
                message.role === 'user' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your issue in detail... (e.g., 'A government official asked for money to process my permit')"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`px-3 py-2 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-100 text-red-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Voice input"
          >
            {isListening ? '🔴' : '🎤'}
          </button>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !userInput.trim()}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>🔍</span>
                <span>Auto-Categorize</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleChat}
            disabled={!userInput.trim()}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-800 mb-2">💡 Quick Tips:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Be specific about what happened, when, and where</li>
          <li>• Mention any officials or departments involved</li>
          <li>• Include amounts if money was involved</li>
          <li>• Use voice input for hands-free reporting</li>
        </ul>
      </div>
    </div>
  );
}
