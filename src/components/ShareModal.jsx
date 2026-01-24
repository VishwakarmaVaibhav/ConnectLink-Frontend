import {
  FaFacebookF,
  FaFacebookMessenger,
  FaWhatsapp,
  FaEnvelope,
  FaTwitter,
  FaLink,
} from "react-icons/fa";
import { X, Share2, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ShareModal({ postId }) {
  const [copied, setCopied] = useState(false);
  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareOptions = [
    {
      icon: <FaLink />,
      label: "Copy link",
      onClick: handleCopyLink,
      color: "bg-gradient-to-r from-gray-500 to-gray-600",
      hoverColor: "hover:from-gray-600 hover:to-gray-700",
      copied: copied,
    },
    {
      icon: <FaFacebookF />,
      label: "Facebook",
      onClick: () =>
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank'),
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800",
    },
    {
      icon: <FaFacebookMessenger />,
      label: "Messenger",
      onClick: () =>
        window.open(`fb-messenger://share/?link=${encodeURIComponent(postUrl)}`, '_blank'),
      color: "bg-gradient-to-r from-blue-500 to-purple-600",
      hoverColor: "hover:from-blue-600 hover:to-purple-700",
    },
    {
      icon: <FaWhatsapp />,
      label: "WhatsApp",
      onClick: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, '_blank'),
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
    },
    {
      icon: <FaEnvelope />,
      label: "Email",
      onClick: () =>
        window.open(`mailto:?subject=Check this out!&body=${encodeURIComponent(postUrl)}`, '_blank'),
      color: "bg-gradient-to-r from-red-500 to-red-600",
      hoverColor: "hover:from-red-600 hover:to-red-700",
    },
    {
      icon: <FaTwitter />,
      label: "X (Twitter)",
      onClick: () =>
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`, '_blank'),
      color: "bg-gradient-to-r from-gray-800 to-black",
      hoverColor: "hover:from-gray-900 hover:to-gray-800",
    },
  ];

  return (
    <div className="relative bg-base-100 rounded-2xl shadow-2xl p-6 max-w-sm mx-auto animate-scaleIn border border-base-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Share2 className="text-blue-600" size={20} />
          </div>
          <h3 className="text-lg font-semibold text-base-content">Share Post</h3>
        </div>
        
        <button
          className="text-base-content/40 hover:text-base-content/70 hover:bg-base-200 p-2 rounded-lg transition-all duration-300 transform hover:scale-110"
          onClick={() => window.dispatchEvent(new CustomEvent("closeShareModal"))}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Share Options Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {shareOptions.map(({ icon, label, onClick, color, hoverColor, copied }) => (
          <button
            key={label}
            onClick={onClick}
            className="group flex flex-col items-center p-4 rounded-xl hover:bg-base-200 
                     transition-all duration-300 transform hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <div 
              className={`${color} ${hoverColor} p-3 rounded-full text-white text-lg 
                        transition-all duration-300 shadow-lg group-hover:shadow-xl
                        transform group-hover:scale-110 relative overflow-hidden`}
            >
              {copied && label === "Copy link" ? (
                <Check size={16} className="animate-bounce" />
              ) : (
                icon
              )}
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                            transition-transform duration-700"></div>
            </div>
            
            <span className="mt-2 text-xs font-medium text-base-content/70 group-hover:text-base-content 
                           transition-colors duration-300">
              {copied && label === "Copy link" ? "Copied!" : label}
            </span>
          </button>
        ))}
      </div>

      {/* URL Preview */}
      <div className="bg-base-200 rounded-xl p-4 border border-base-300">
        <p className="text-xs font-medium text-base-content/70 mb-2">Share URL:</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-base-100 border border-base-300 rounded-lg px-3 py-2 overflow-hidden">
            <p className="text-sm text-base-content/80 truncate">{postUrl}</p>
          </div>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg 
                     transition-all duration-300 transform hover:scale-105 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            title="Copy URL"
          >
            {copied ? <Check size={16} /> : <FaLink size={14} />}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center">
        <p className="text-xs text-base-content/60">
          Share this post with your network
        </p>
      </div>

      <style jsx>{`
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
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
        
        .animate-bounce {
          animation: bounce 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}