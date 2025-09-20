import { useState, useRef, useEffect } from "react";
import { Pencil, Sparkles, Send, X, Loader, User, Wand2, ChevronDown, ChevronUp } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

const AboutSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about || "");
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  const textareaRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    onSave({ about });
    toast.success("About section updated successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAbout(userData.about || "");
    setShowSuggestions(false);
  };

  // Auto-complete functionality
  const generateAutoComplete = async (text) => {
    if (text.length < 20) return;
    
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Complete this professional "About Me" section for a student networking profile. Only provide the completion text, keep it professional yet personable, and focus on skills, interests, and goals:

      "${text}"`;
      
      const result = await model.generateContent(prompt);
      const suggestion = result.response.text().trim();
      
      setCurrentSuggestion(suggestion);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Auto-complete error:", error);
    }
  };

  const handleAboutChange = (e) => {
    const newAbout = e.target.value;
    setAbout(newAbout);
    
    // Trigger auto-complete when user pauses typing
    if (newAbout.length > 20 && newAbout.endsWith(' ')) {
      const timeoutId = setTimeout(() => {
        generateAutoComplete(newAbout);
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
    }
  };

  const acceptSuggestion = () => {
    setAbout(about + currentSuggestion);
    setShowSuggestions(false);
    setCurrentSuggestion("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab' && showSuggestions) {
      e.preventDefault();
      acceptSuggestion();
    } else if (e.key === 'Escape' && showSuggestions) {
      setShowSuggestions(false);
    }
  };

  // AI Modal functionality
  const generateAIAbout = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setAiLoading(true);
      
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Create a professional and engaging "About Me" section for a student networking profile based on this information:

      "${aiPrompt}"

      Requirements:
      - Professional yet personable tone
      - Highlight key skills, interests, and goals
      - Include personality traits that make them memorable
      - Focus on what makes them unique
      - Keep it concise but informative (150-250 words)
      - Write in first person
      - Include their aspirations and what they're passionate about`;
      
      const result = await model.generateContent(prompt);
      const generatedAbout = result.response.text().trim();
      
      setAbout(generatedAbout);
      setShowAIModal(false);
      setAiPrompt("");
      toast.success("AI about section generated!");
      
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate about section");
    } finally {
      setAiLoading(false);
    }
  };

  const quickSuggestions = [
    "I'm studying Computer Science and passionate about web development...",
    "As a business student, I'm interested in entrepreneurship and innovation...",
    "I'm pursuing Engineering with a focus on sustainable technology...",
    "Currently studying Design, with a love for creating user-friendly experiences..."
  ];

  const handleQuickSuggestion = (suggestion) => {
    setAbout(suggestion);
    setShowSuggestions(false);
  };

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden
                      transition-all duration-700 ease-out transform hover:shadow-lg hover:shadow-gray-200/50
                      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <User className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">About</h2>
            </div>
            
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-blue-600 
                         hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Pencil size={16} />
                <span className="text-sm font-medium">Edit</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {isEditing ? (
            <div className="space-y-4">
              {/* Textarea with suggestions */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={about}
                  onChange={handleAboutChange}
                  onKeyDown={handleKeyDown}
                  rows="6"
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white 
                           transition-all duration-300 resize-none leading-relaxed"
                  placeholder="Tell us about yourself, your interests, goals, and what makes you unique..."
                />
                
                {/* Character count */}
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {about.length}/500
                </div>
              </div>

              {/* Auto-complete suggestion */}
              {showSuggestions && currentSuggestion && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 
                              rounded-xl p-4 animate-fadeInUp">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-blue-600 mb-2 font-medium flex items-center gap-1">
                        <Sparkles size={12} />
                        AI Suggestion (Press Tab to accept)
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">{currentSuggestion}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={acceptSuggestion}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg 
                                 hover:bg-blue-600 transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => setShowSuggestions(false)}
                        className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-lg 
                                 hover:bg-gray-300 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick suggestions for empty state */}
              {!about && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 font-medium">Quick start ideas:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {quickSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="text-left p-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 
                                 hover:border-blue-300 rounded-lg transition-all duration-300 
                                 text-sm text-gray-700 hover:text-blue-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
                {/* AI Assistant */}
                <button
                  onClick={() => setShowAIModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 
                           to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 
                           transition-all transform hover:scale-105 text-sm font-medium"
                >
                  <Wand2 size={16} />
                  AI Assistant
                </button>

                {/* Save/Cancel buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 
                             rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!about.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                             transition-all duration-300 text-sm font-medium transform hover:scale-105
                             disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              {userData.about ? (
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {userData.about}
                </p>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <User className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 mb-4">No information added yet.</p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                               rounded-lg hover:bg-blue-700 transition-all duration-300 
                               transform hover:scale-105 text-sm font-medium"
                    >
                      <Pencil size={16} />
                      Add About Section
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center 
                      z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-lg animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <Sparkles className="text-purple-600" size={20} />
                </div>
                AI About Generator
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg 
                         transition-all duration-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Tell us about yourself to generate a professional about section:
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Include your field of study, interests, skills, career goals, hobbies, achievements, or anything that makes you unique..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 
                           focus:ring-purple-500 focus:border-transparent resize-none h-32
                           transition-all duration-300"
                />
                <p className="text-xs text-gray-500 mt-2">
                  The more details you provide, the better your AI-generated about section will be!
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl 
                           hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIAbout}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 
                           text-white rounded-xl hover:from-purple-600 hover:to-pink-600 
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2 font-medium transform hover:scale-105
                           disabled:transform-none"
                >
                  {aiLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Generate About
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default AboutSection;