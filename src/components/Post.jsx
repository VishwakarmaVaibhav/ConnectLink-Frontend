import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Pagination } from "swiper/modules";

import ShareModal from "./ShareModal";
import { createPortal } from "react-dom";

import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useRef } from "react";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  ExternalLink,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  FileText,
  Download
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";
import AuthModal from "./AuthModal";

import LoadingSpinner from "./common/LoadingSpinner";

const Post = ({ post, authUser }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments ?? []);
  const [isVisible, setIsVisible] = useState(false);

  // Video state
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const isMediaVideo = (url) => {
    return url?.includes("/video/upload/") || url?.endsWith(".mp4") || url?.endsWith(".webm") || url?.endsWith(".mov");
  };

  const isMediaPDF = (url) => {
    return url?.endsWith(".pdf") || url?.includes("pdf");
  };

  if (!post || !post.author) {
    return (
      <div className="flex justify-center items-center h-40">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  useEffect(() => {
    setIsVisible(true);
    const handleClose = () => setShowShareModal(false);
    window.addEventListener("closeShareModal", handleClose);
    return () => window.removeEventListener("closeShareModal", handleClose);
  }, []);

  const isOwner = authUser?._id === post.author._id;
  const isLiked = post.likes?.some((id) => id === authUser?._id);

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: () => axiosInstance.delete(`/posts/delete/${post._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: (content) => axiosInstance.post(`/posts/${post._id}/comment`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Comment added successfully");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add comment"),
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: () => axiosInstance.post(`/posts/${post._id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      if (postId) queryClient.invalidateQueries(["post", postId]);
    },
  });

  const handleDeletePost = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost();
    }
  };

  const handleLikePost = () => {
    if (!authUser) {
      setShowAuthModal(true);
      return;
    }
    likePost();
  };

  const handleSharePost = () => {
    setShowShareModal(true);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (isAddingComment) return;
    if (!authUser) {
      setShowAuthModal(true);
      return;
    }
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    createComment(trimmedComment);
    setNewComment("");
    setComments((prev) => [
      ...prev,
      {
        _id: Math.random().toString(36).substring(2, 9),
        content: trimmedComment,
        user: {
          _id: authUser._id,
          name: authUser.name,
          profilePicture: authUser.profilePicture,
        },
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderMedia = (mediaUrl, idx) => {
    if (isMediaPDF(mediaUrl)) {
      return (
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 min-h-[280px] flex flex-col items-center justify-center border border-base-300">
          <div className="bg-base-100 rounded-2xl p-6 shadow-lg mb-4">
            <FileText size={48} className="text-red-500" />
          </div>
          <h4 className="text-lg font-semibold text-base-content mb-2">PDF Document</h4>
          <p className="text-sm text-base-content/70 mb-6">Click to view the document</p>
          <div className="flex gap-3">
            <a
              href={mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <ExternalLink size={16} />
              View PDF
            </a>
            <a
              href={mediaUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <Download size={16} />
              Download
            </a>
          </div>
        </div>
      );
    }

    if (isMediaVideo(mediaUrl)) {
      return (
        <div className="relative group w-full bg-gray-900 rounded-xl overflow-hidden flex justify-center items-center">
          <video
            ref={idx === 0 ? videoRef : null}
            src={mediaUrl}
            className="max-h-[280px] w-auto h-auto max-w-full object-contain mx-auto"
            muted={isMuted}
            playsInline
            loop
            onClick={toggleVideoPlayback}
          />

          {/* Video Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
              <button
                onClick={toggleVideoPlayback}
                className="bg-base-100/90 backdrop-blur-sm text-base-content p-4 rounded-full hover:bg-base-100 transition-all duration-300 transform hover:scale-110 shadow-2xl active:scale-95"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
              </button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black/70 backdrop-blur-sm text-white p-2.5 rounded-full hover:bg-black/90 transition-all duration-300 transform hover:scale-110 shadow-lg active:scale-95"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="relative group w-full bg-transparent rounded-xl overflow-hidden flex justify-center items-center">
        <img
          src={mediaUrl}
          alt={`Post media ${idx + 1}`}
          className="max-h-[280px] w-auto h-auto max-w-full object-contain mx-auto cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]"
          onClick={() => {
            setShowFullImage(true);
            setCurrentImageIndex(idx);
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />
      </div>
    );
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <article
        className={`bg-base-100 rounded-2xl shadow-sm border border-base-300 mb-4 overflow-hidden
          transition-all duration-500 hover:shadow-xl hover:border-base-content/20`}
      >
        {/* Header */}
        <div className="p-3 lg:p-4">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link
                to={`/profile/${post.author.username}`}
                aria-label={`${post.author.name}'s profile`}
                className="group shrink-0"
              >
                <div className="relative">
                  <img
                    src={post.author.profilePicture || "/avatar.png"}
                    alt={post.author.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-primary/20 
                             group-hover:ring-primary transition-all duration-300 
                             group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/profile/${post.author.username}`} className="group block">
                  <h3 className="font-semibold text-base-content group-hover:text-primary 
                               transition-colors duration-300 text-base sm:text-lg truncate">
                    {post.author.name}
                  </h3>
                </Link>
                <p className="text-xs sm:text-sm text-base-content/60 font-medium truncate">{post.author.headline}</p>
                <time className="text-xs text-base-content/50 flex items-center gap-1.5 mt-0.5">
                  <span className="w-1 h-1 bg-base-content/30 rounded-full"></span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </time>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleDeletePost}
                className="text-base-content/40 hover:text-red-500 hover:bg-red-50 p-2 rounded-full
                         transition-all duration-300 transform hover:scale-110 active:scale-95 shrink-0 ml-2"
                aria-label="Delete Post"
                disabled={isDeletingPost}
              >
                {isDeletingPost ?
                  <LoadingSpinner size="sm" /> :
                  <Trash2 size={18} />
                }
              </button>
            )}
          </header>

          {/* Content */}
          {post.content && (
            <div className="mb-4">
              <p className="text-base-content leading-relaxed whitespace-pre-wrap text-sm sm:text-[15px]">
                {post.content}
              </p>
            </div>
          )}

          {post.projectLink && (
            <div className="mb-4">
              <a
                href={post.projectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-focus text-primary-content rounded-full font-medium 
                         hover:shadow-lg transition-all duration-300 text-sm shadow-md transform hover:scale-105 active:scale-95"
              >
                <ExternalLink size={14} />
                View Project
              </a>
            </div>
          )}
        </div>

        {/* Media (Images/Video/PDF) */}
        {Array.isArray(post.image) && post.image.length > 0 ? (
          <div className="mb-0">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              autoHeight={true}
              className="post-swiper"
              style={{ width: "100%" }}
              grabCursor
            >
              {post.image.map((mediaUrl, idx) => (
                <SwiperSlide key={idx}>
                  <div className="px-4 lg:px-6 pb-4">
                    {renderMedia(mediaUrl, idx)}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : typeof post.image === "string" && post.image ? (
          <div className="px-4 lg:px-6 pb-4">
            {renderMedia(post.image, 0)}
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="px-4 lg:px-6 py-3 border-t border-base-200 bg-base-200/50">
          <div className="flex justify-around items-center text-base-content/70 gap-2">
            <button
              onClick={handleLikePost}
              disabled={isLikingPost}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full font-medium
                       transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base
                       ${isLiked
                  ? 'text-primary bg-primary/10 hover:bg-primary/20'
                  : 'hover:bg-base-100 hover:text-primary hover:shadow-sm'
                }`}
            >
              <ThumbsUp
                size={18}
                className={`transition-all duration-300 ${isLiked ? 'fill-current' : ''}`}
              />
              <span className="text-sm font-semibold">
                {Array.isArray(post.likes) ? post.likes.length : 0}
              </span>
            </button>

            <button
              onClick={() => setShowComments((prev) => !prev)}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full font-medium
                       transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm sm:text-base
                       ${showComments ? 'bg-primary/10 text-primary' : 'hover:bg-base-100 hover:text-primary hover:shadow-sm'}`}
            >
              <MessageCircle size={18} />
              <span className="text-sm font-semibold">
                {Array.isArray(comments) ? comments.length : 0}
              </span>
            </button>

            <button
              onClick={handleSharePost}
              className="flex items-center gap-2 px-3 sm:px-5 py-2.5 rounded-full font-medium
                       hover:bg-base-100 hover:text-primary transition-all duration-300 
                       transform hover:scale-105 active:scale-95 hover:shadow-sm text-sm sm:text-base"
            >
              <Share2 size={18} />
              <span className="hidden sm:inline text-sm font-semibold">Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden
                      ${showComments ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <section className="px-4 lg:px-6 pb-6 bg-base-200/30">
            <div className="pt-4 mb-4 max-h-80 overflow-y-auto space-y-3 custom-scrollbar">
              {!Array.isArray(comments) || comments.length === 0 ? (
                <div className="text-center py-12 bg-base-100 rounded-xl border-2 border-dashed border-base-300">
                  <MessageCircle size={40} className="mx-auto text-base-content/30 mb-3" />
                  <p className="text-base-content/60 font-medium">No comments yet</p>
                  <p className="text-base-content/40 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map(({ _id, content, user, createdAt }, index) => (
                  <article
                    key={_id}
                    className={`flex items-start space-x-3 animate-fadeInUp`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <Link to={`/profile/${user?.username || user?._id}`} className="group shrink-0">
                      <img
                        src={user?.profilePicture || "/avatar.png"}
                        alt={user?.name || "User"}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-transparent 
                                 group-hover:ring-primary transition-all duration-300"
                        loading="lazy"
                      />
                    </Link>
                    <div className="bg-base-100 p-3 sm:p-4 rounded-2xl flex-1 hover:bg-base-200/50 
                                  transition-all duration-300 shadow-sm hover:shadow-md border border-base-200">
                      <header className="flex items-center justify-between mb-1.5 gap-2">
                        <Link to={`/profile/${user?.username || user?._id}`} className="min-w-0 flex-1">
                          <h4 className="font-semibold text-base-content hover:text-primary 
                                       transition-colors duration-300 text-sm truncate">
                            {user?.name}
                          </h4>
                        </Link>
                        <time className="text-xs text-base-content/50 whitespace-nowrap">
                          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </time>
                      </header>
                      <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed text-sm">
                        {content}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Comment Input or Guest Prompt */}
            {authUser ? (
              <form onSubmit={handleAddComment} className="flex items-center gap-2 sm:gap-3">
                <img
                  src={authUser.profilePicture || "/avatar.png"}
                  alt={authUser.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 flex items-center bg-base-100 rounded-full overflow-hidden
                              focus-within:ring-2 focus-within:ring-primary transition-all duration-300 shadow-sm border border-base-300">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-grow px-4 sm:px-5 py-2.5 sm:py-3 bg-transparent focus:outline-none text-base-content
                             placeholder-base-content/40 text-sm"
                    aria-label="Write a comment"
                    disabled={isAddingComment}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isAddingComment || !newComment.trim()}
                    className="bg-primary text-primary-content p-2.5 sm:p-3 hover:bg-primary-focus transition-all duration-300 
                             flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed
                             transform hover:scale-105 active:scale-95"
                    aria-label="Submit comment"
                  >
                    {isAddingComment ?
                      <LoadingSpinner size="sm" /> :
                      <Send size={16} />
                    }
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 bg-base-100 rounded-xl border border-base-200">
                <p className="text-base-content/70 mb-4 font-medium">Join the conversation</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-focus text-primary-content 
                           rounded-full hover:shadow-lg transition-all duration-300 
                           transform hover:scale-105 shadow-md font-medium"
                >
                  Login to comment
                </Link>
              </div>
            )}
          </section>
        </div>
      </article>

      {/* Share Modal */}
      {showShareModal && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center
                   animate-fadeIn p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="animate-scaleIn w-full max-w-md"
          >
            <ShareModal postId={post._id} />
          </div>
        </div>,
        document.body
      )}

      {/* Full Image Modal */}
      {showFullImage && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-fadeIn"
          onClick={() => setShowFullImage(false)}
        >
          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 text-white hover:text-gray-300 
                     bg-black/50 p-2 sm:p-3 rounded-full transition-all duration-300 
                     transform hover:scale-110 backdrop-blur-sm"
          >
            <X size={24} />
          </button>
          <Swiper
            initialSlide={currentImageIndex}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full h-full max-h-[95vh] fullscreen-swiper"
          >
            {(Array.isArray(post.image) ? post.image : [post.image])
              .filter(url => !isMediaPDF(url) && !isMediaVideo(url))
              .map((imgUrl, idx) => (
                <SwiperSlide key={idx} className="flex items-center justify-center p-4">
                  <img
                    src={imgUrl}
                    alt="Full view"
                    className="object-contain max-h-[90vh] max-w-full mx-auto animate-scaleIn rounded-lg"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>,
        document.body
      )}

      {/* Auth Modal for Guests */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95) translateY(20px); 
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
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out both;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        .post-swiper .swiper-button-next,
        .post-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.6);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        
        .post-swiper .swiper-button-next:hover,
        .post-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.85);
          transform: scale(1.1);
        }

        .post-swiper .swiper-button-next:after,
        .post-swiper .swiper-button-prev:after {
          font-size: 16px;
        }
        
        .post-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.6);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        
        .post-swiper .swiper-pagination-bullet-active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }
        
        .fullscreen-swiper .swiper-button-next,
        .fullscreen-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(4px);
        }

        .fullscreen-swiper .swiper-button-next:hover,
        .fullscreen-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .fullscreen-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          width: 10px;
          height: 10px;
        }
        
        .fullscreen-swiper .swiper-pagination-bullet-active {
          background: white;
          width: 30px;
          border-radius: 5px;
        }

        @media (max-width: 640px) {
          .post-swiper .swiper-button-next,
          .post-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .post-swiper .swiper-button-next:after,
          .post-swiper .swiper-button-prev:after {
            font-size: 14px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Post;