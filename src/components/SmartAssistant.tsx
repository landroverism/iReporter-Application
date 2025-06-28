import React, { useState, useEffect } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { toast } from 'sonner';
import { awsConfig } from '../aws-config';

// AWS SDK will be loaded from CDN in useEffect

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
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  // Initialize AWS SDK for Amazon Polly
  useEffect(() => {
    // Check if AWS SDK is loaded from CDN
    if (typeof window.AWS !== 'undefined') {
      try {
        // Configure AWS with our configuration
        window.AWS.config.update({
          region: awsConfig.region,
          credentials: new window.AWS.Credentials({
            accessKeyId: awsConfig.credentials.accessKeyId,
            secretAccessKey: awsConfig.credentials.secretAccessKey
          })
        });
        
        console.log('AWS SDK configured successfully');
      } catch (error) {
        console.error('Error configuring AWS SDK:', error);
        toast.error('Voice service initialization failed');
      }
    } else {
      console.error('AWS SDK not loaded');
      toast.error('Voice service initialization failed');
    }
  }, []);

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

  // Function to speak a message using Amazon Polly
  const speakMessage = (message: string) => {
    // Set the flag to indicate AI is speaking
    setIsAISpeaking(true);
    
    // Check if AWS SDK is loaded
    if (typeof window.AWS !== 'undefined') {
      try {
        // Create a Polly service object
        const polly = new window.AWS.Polly();
        
        // Set the parameters
        const params = {
          OutputFormat: "mp3",
          Text: message,
          TextType: "text",
          VoiceId: "Joanna", // Joanna is a female voice
          Engine: "neural", // Use neural engine for better quality
        };
        
        console.log('Requesting speech from Amazon Polly...');
        toast.info('🎤 Preparing voice...');
        
        // Call Amazon Polly to synthesize speech
        polly.synthesizeSpeech(params, (err: any, data: any) => {
          if (err) {
            console.error('Error calling Amazon Polly:', err);
            toast.error('Voice service failed');
            setIsAISpeaking(false);
            return;
          }
          
          // Convert the binary audio stream to an audio element
          if (data.AudioStream) {
            // Convert the audio stream to a blob
            const uInt8Array = new Uint8Array(data.AudioStream);
            const blob = new Blob([uInt8Array.buffer], { type: 'audio/mp3' });
            const url = URL.createObjectURL(blob);
            
            // Create an audio element to play the speech
            const audio = new Audio(url);
            
            // Add event listeners
            audio.onended = () => {
              console.log('Speech playback ended');
              setIsAISpeaking(false);
              URL.revokeObjectURL(url); // Clean up
            };
            
            audio.onerror = () => {
              console.error('Audio playback error');
              toast.error('Voice playback failed');
              setIsAISpeaking(false);
              URL.revokeObjectURL(url); // Clean up
            };
            
            // Start playing
            console.log('Playing audio from Amazon Polly');
            audio.play()
              .then(() => {
                toast.success('🎤 AI Assistant speaking');
              })
              .catch((error) => {
                console.error('Failed to play audio:', error);
                toast.error('Voice playback failed');
                setIsAISpeaking(false);
              });
          } else {
            console.error('No AudioStream in the response');
            toast.error('Voice service returned invalid data');
            setIsAISpeaking(false);
          }
        });
        
        // Set a timeout as a fallback in case the AWS call hangs
        setTimeout(() => {
          setIsAISpeaking(false);
        }, 10000); // 10 seconds timeout
        
      } catch (error) {
        console.error('Error using Amazon Polly:', error);
        toast.error('Voice service error');
        setIsAISpeaking(false);
      }
    } else {
      // Fallback if AWS SDK is not loaded
      toast.info('🎤 ' + message);
      console.log('AWS SDK not available, cannot use Amazon Polly');
      setIsAISpeaking(false);
    }
  };

  // Handle voice input for the AI assistant
  const startVoiceInput = () => {
    // Don't start listening if AI is currently speaking
    if (isAISpeaking) {
      toast.info('Please wait until the AI finishes speaking');
      return;
    }
    
    if (!isListening) {
      // First speak the message
      speakMessage("Describe your issue, I solve, let's start");
      
      // Then start speech recognition after the AI has finished speaking
      // The speech recognition will be started when isAISpeaking becomes false
      const checkAISpeakingStatus = () => {
        if (!isAISpeaking) {
          // AI has finished speaking, now start listening
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
        } else {
          // AI is still speaking, check again after a short delay
          setTimeout(checkAISpeakingStatus, 300);
        }
      };
      
      // Start checking if AI has finished speaking
      checkAISpeakingStatus();
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 sm:p-6 border border-purple-200">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-300 shadow-sm">
          <img src="/ai-image.avif" alt="AI Assistant" className="w-full h-full object-cover" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Smart Assistant</h3>
        <div className="text-xs sm:text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
          AI-Powered
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Describe your issue and I'll help categorize it and suggest improvements to your report.
      </p>

      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 max-h-40 overflow-y-auto">
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
        <div className="flex flex-col sm:flex-row gap-2 relative">
          <div className="relative w-full">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your issue (e.g., bribe requested by gov't official to process permit)"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 resize-none shadow-sm transition-all duration-200 bg-white/80 backdrop-blur-sm"
              rows={3}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(0, 0, 0, 0.03)' }}
            />
            {/* Purple dot indicator at bottom right */}
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-purple-500"></div>
          </div>
          <button
            onClick={startVoiceInput}
            disabled={isListening}
            className={`sm:self-start p-2 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg ${
              isListening 
                ? 'bg-red-600 text-white animate-pulse' 
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            title={isListening ? "Stop recording" : "Voice input"}
            aria-label={isListening ? "Stop recording" : "Voice input"}
          >
            {isListening ? (
              <i className="fa-solid fa-circle-stop"></i>
            ) : (
              <i className="fa-solid fa-microphone"></i>
            )}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !userInput.trim()}
            className="w-full bg-purple-600 text-white py-2 px-3 sm:px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                  <img src="/ai-image.avif" alt="AI" className="w-full h-full object-cover" />
                </div>
                <span>Auto-Categorize</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleChat}
            disabled={!userInput.trim()}
            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-comments"></i>
            <span>Chat</span>
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-lightbulb text-amber-500"></i>
          Quick Tips:
        </h4>
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
