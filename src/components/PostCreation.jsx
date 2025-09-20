import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { 
  Image, 
  Loader, 
  Sparkles, 
  Send, 
  X, 
  GripVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import imageCompression from "browser-image-compression";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [projectLink, setProjectLink] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  
  // AI Modal states
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  
  // Auto-complete states
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState("");
  const [suggestionStartPos, setSuggestionStartPos] = useState(0);
  
  // Image preview states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);
  
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully", { position: "top-right" });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create post", { position: "top-right" });
    },
  });

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
  const MAX_IMAGES = 5;

  // Auto-complete functionality
  const generateAutoComplete = async (text) => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Complete this social media post in a natural, engaging way. Only provide the completion text, not the original text. Keep it concise and relevant to student networking:
      
      "${text}"`;
      
      const result = await model.generateContent(prompt);
      const suggestion = result.response.text().trim();
      
      setCurrentSuggestion(suggestion);
      setShowSuggestions(true);
      setSuggestionStartPos(text.length);
    } catch (error) {
      console.error("Auto-complete error:", error);
    }
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Trigger auto-complete when user pauses typing
    if (newContent.length > 10 && newContent.endsWith(' ')) {
      const timeoutId = setTimeout(() => {
        generateAutoComplete(newContent);
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowSuggestions(false);
    }
  };

  const acceptSuggestion = () => {
    setContent(content + currentSuggestion);
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
  const generateAIContent = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      setAiLoading(true);
      
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GENAI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `Create a professional yet friendly social media post for a student networking platform called ConnectLink. 
      
      User request: "${aiPrompt}"
      ${projectLink ? `Include this project link naturally: ${projectLink}` : ""}
      
      Requirements:
      - Keep it engaging and authentic
      - Suitable for student networking
      - Include relevant hashtags
      - One clear, focused message
      - Maximum 280 characters`;
      
      const result = await model.generateContent(prompt);
      const generatedContent = result.response.text().trim();
      
      setContent(generatedContent);
      setShowAIModal(false);
      setAiPrompt("");
      toast.success("AI content generated!");
      
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Failed to generate content");
    } finally {
      setAiLoading(false);
    }
  };

  // Image handling
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    if (files.length + images.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const newCompressedImages = [];
    const newPreviews = [];

    for (let file of files) {
      try {
        if (file.size > MAX_IMAGE_SIZE) {
          toast("Compressing large image...");
          const compressedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
          const base64 = await readFileAsDataURL(compressedFile);
          newCompressedImages.push(compressedFile);
          newPreviews.push(base64);
        } else {
          const base64 = await readFileAsDataURL(file);
          newCompressedImages.push(file);
          newPreviews.push(base64);
        }
      } catch (err) {
        console.error("Image compression failed:", err);
        toast.error("Failed to process image");
      }
    }

    setImages((prev) => [...prev, ...newCompressedImages]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (currentImageIndex >= imagePreviews.length - 1) {
      setCurrentImageIndex(Math.max(0, imagePreviews.length - 2));
    }
  };

  // Drag and drop for image reordering
  const handleDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedImageIndex === null || draggedImageIndex === dropIndex) return;
    
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    
    // Remove dragged items
    const [draggedImage] = newImages.splice(draggedImageIndex, 1);
    const [draggedPreview] = newPreviews.splice(draggedImageIndex, 1);
    
    // Insert at new position
    newImages.splice(dropIndex, 0, draggedImage);
    newPreviews.splice(dropIndex, 0, draggedPreview);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
    setDraggedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : imagePreviews.length - 1);
    } else {
      setCurrentImageIndex((prev) => prev < imagePreviews.length - 1 ? prev + 1 : 0);
    }
  };

  const handlePostCreation = async () => {
    try {
      let postData = { content, projectLink };

      if (images.length > 0) {
        const base64Images = await Promise.all(images.map(readFileAsDataURL));
        postData.images = base64Images;
      }

      createPost(postData);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const resetForm = () => {
    setContent("");
    setImages([]);
    setImagePreviews([]);
    setProjectLink("");
    setCurrentImageIndex(0);
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <img
            src={user.profilePicture || "/avatar.png"}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
          />
          
          <div className="w-full relative">
            <textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={content}
              onChange={handleContentChange}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 
                       focus:ring-blue-500 transition-all p-4 rounded-xl resize-none 
                       min-h-[120px] focus:outline-none text-sm text-gray-800 
                       border border-transparent"
            />
            
            {/* Auto-complete suggestion */}
            {showSuggestions && currentSuggestion && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 
                            rounded-xl shadow-lg p-4 z-10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-2">AI Suggestion (Press Tab to accept)</p>
                    <p className="text-gray-700 text-sm">{currentSuggestion}</p>
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
          </div>
        </div>

        {/* Image Previews with Navigation */}
        {imagePreviews.length > 0 && (
          <div className="mt-6">
            <div className="relative bg-gray-50 rounded-xl overflow-hidden">
              {/* Main Image Display */}
              <div className="relative h-80 flex items-center justify-center">
                <img
                  src={imagePreviews[currentImageIndex]}
                  alt={`Preview ${currentImageIndex + 1}`}
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
                
                {/* Navigation Arrows */}
                {imagePreviews.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateImage('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 
                               hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => navigateImage('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 
                               hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
                
                {/* Remove Button */}
                <button
                  onClick={() => removeImage(currentImageIndex)}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white 
                           p-2 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              
              {/* Thumbnail Strip */}
              {imagePreviews.length > 1 && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden 
                                  cursor-pointer transition-all border-2 hover:scale-105
                                  ${index === currentImageIndex 
                                    ? 'border-blue-500 ring-2 ring-blue-200' 
                                    : 'border-transparent hover:border-gray-300'}`}
                      >
                        <img
                          src={preview}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                                      hover:opacity-100 transition-opacity">
                          <GripVertical size={14} className="text-white drop-shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Drag thumbnails to reorder • Click to preview
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Link */}
        <div className="mt-4">
          <input
            type="url"
            placeholder="🔗 Project link (optional)"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:bg-white transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
          {/* Add Photo Button */}
          <label className="flex items-center text-blue-500 cursor-pointer hover:text-blue-700 
                          transition-all duration-200 hover:bg-blue-50 px-3 py-2 rounded-lg">
            <Image size={20} className="mr-2" />
            <span className="text-sm font-medium">Add Photos</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
          </label>

          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 
                     text-white text-sm px-4 py-2 rounded-lg hover:from-purple-600 
                     hover:to-pink-600 transition-all transform hover:scale-105"
          >
            <Sparkles size={16} />
            AI Assistant
          </button>

          {/* Post Button */}
          <button
            onClick={handlePostCreation}
            disabled={isPending || !content.trim()}
            className="bg-blue-500 text-white text-sm px-6 py-2 rounded-lg hover:bg-blue-600 
                     transition-all disabled:opacity-60 disabled:cursor-not-allowed
                     transform hover:scale-105 font-medium"
          >
            {isPending ? (
              <Loader className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </div>

      {/* AI Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center 
                      z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 m-4 w-full max-w-md animate-scaleIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="text-purple-500" size={20} />
                AI Content Generator
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What would you like to post about?
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., My latest web development project, networking event experience, study tips..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 
                           focus:ring-purple-500 focus:border-transparent resize-none h-24"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                           hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generateAIContent}
                  disabled={aiLoading || !aiPrompt.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 
                           text-white rounded-lg hover:from-purple-600 hover:to-pink-600 
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Generate
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
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
      `}</style>
    </>
  );
};

export default PostCreation;