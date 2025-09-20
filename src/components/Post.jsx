import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  ExternalLink,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";

const Post = ({ post, authUser }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments ?? []);
  const [isVisible, setIsVisible] = useState(false);

  if (!post || !post.author) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  const { mutate: deletePost, isLoading: isDeletingPost } = useMutation({
    mutationFn: () => axiosInstance.delete(`/posts/delete/${post._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Post deleted successfully");
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: createComment, isLoading: isAddingComment } = useMutation({
    mutationFn: (content) => axiosInstance.post(`/posts/${post._id}/comment`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Comment added successfully");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add comment"),
  });

  const { mutate: likePost, isLoading: isLikingPost } = useMutation({
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
      toast.error("Please log in to like the post.");
      return;
    }
    if (!isLikingPost) {
      likePost();
    }
  };

  const handleSharePost = () => {
    setShowShareModal(true);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment || !authUser) return;

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

  return (
    <div>
      <article 
        className={`bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden
          transition-all duration-700 ease-out transform hover:shadow-lg hover:shadow-gray-200/50
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <header className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                to={`/profile/${post.author.username}`} 
                aria-label={`${post.author.name}'s profile`}
                className="group"
              >
                <div className="relative">
                  <img
                    src={post.author.profilePicture || "/avatar.png"}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent 
                             group-hover:ring-blue-500/30 transition-all duration-300 
                             group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 
                                to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity 
                                duration-300"></div>
                </div>
              </Link>
              <div className="flex-1">
                <Link to={`/profile/${post.author.username}`} className="group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 
                               transition-colors duration-300 text-lg">
                    {post.author.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 font-medium">{post.author.headline}</p>
                <time className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </time>
              </div>
            </div>
            {isOwner && (
              <button
                onClick={handleDeletePost}
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full
                         transition-all duration-300 transform hover:scale-110"
                aria-label="Delete Post"
                disabled={isDeletingPost}
              >
                {isDeletingPost ? 
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div> : 
                  <Trash2 size={18} />
                }
              </button>
            )}
          </header>
        </div>

        {/* Content */}
        <div className="px-6">
          {post.content && (
            <div className="mb-6">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-[15px]">
                {post.content}
              </p>
            </div>
          )}

          {post.projectLink && (
            <div className="mb-6">
              <a 
                href={post.projectLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r 
                         from-blue-500 to-blue-600 text-white rounded-full font-medium 
                         hover:from-blue-600 hover:to-blue-700 transition-all duration-300 
                         transform hover:scale-105 hover:shadow-lg shadow-blue-500/25"
              >
                <ExternalLink size={16} />
                View Project
              </a>
            </div>
          )}

          {/* Images */}
          {Array.isArray(post.image) && post.image.length > 0 ? (
            <div className="mb-6 rounded-xl overflow-hidden">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="post-swiper"
                style={{ width: "100%" }}
                grabCursor
              >
                {post.image.map((imgUrl, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative group">
                      <img
                        src={imgUrl}
                        alt={`Post image ${idx + 1}`}
                        className="w-full h-auto max-h-[500px] object-cover cursor-pointer
                                 transition-transform duration-300 group-hover:scale-[1.02]"
                        onClick={() => {
                          setShowFullImage(true);
                          setCurrentImageIndex(idx);
                        }}
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 
                                    transition-opacity duration-300"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : typeof post.image === "string" ? (
            <div className="mb-6 rounded-xl overflow-hidden group">
              <img
                src={post.image}
                alt="Post content"
                className="rounded-xl w-full object-cover cursor-pointer max-h-[500px]
                         transition-transform duration-300 group-hover:scale-[1.02]"
                onClick={() => {
                  setShowFullImage(true);
                  setCurrentImageIndex(0);
                }}
              />
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-50">
          <div className="flex justify-around text-gray-600">
            <button
              onClick={handleLikePost}
              disabled={isLikingPost}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium
                       transition-all duration-300 transform hover:scale-105
                       ${isLiked 
                         ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                         : 'hover:bg-gray-50 hover:text-blue-600'
                       }`}
            >
              <ThumbsUp 
                size={18} 
                className={`transition-all duration-300 ${
                  isLiked ? 'fill-current animate-pulse' : ''
                }`} 
              />
              <span className="text-sm">
                {Array.isArray(post.likes) ? post.likes.length : 0}
              </span>
            </button>
            
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium
                       hover:bg-gray-50 hover:text-blue-600 transition-all duration-300 
                       transform hover:scale-105"
            >
              <MessageCircle size={18} />
              <span className="text-sm">
                {Array.isArray(comments) ? comments.length : 0}
              </span>
            </button>
            
            <button
              onClick={handleSharePost}
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium
                       hover:bg-gray-50 hover:text-blue-600 transition-all duration-300 
                       transform hover:scale-105"
            >
              <Share2 size={18} />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden
                      ${showComments ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <section className="px-6 pb-6 border-t border-gray-50">
            <div className="pt-4 mb-4 max-h-60 overflow-y-auto space-y-4">
              {!Array.isArray(comments) || comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map(({ _id, content, user, createdAt }, index) => (
                  <article 
                    key={_id} 
                    className={`flex items-start space-x-3 animate-fadeInUp`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/profile/${user?.username || user?._id}`} className="group">
                      <img
                        src={user?.profilePicture || "/avatar.png"}
                        alt={user?.name || "User"}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-transparent 
                                 group-hover:ring-blue-500/30 transition-all duration-300"
                        loading="lazy"
                      />
                    </Link>
                    <div className="bg-gray-50 p-4 rounded-2xl flex-1 hover:bg-gray-100 
                                  transition-colors duration-300">
                      <header className="flex items-center justify-between mb-2">
                        <Link to={`/profile/${user?.username || user?._id}`}>
                          <h4 className="font-semibold text-gray-800 hover:text-blue-600 
                                       transition-colors duration-300">
                            {user?.name}
                          </h4>
                        </Link>
                        <time className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                        </time>
                      </header>
                      <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {content}
                      </p>
                    </div>
                  </article>
                ))
              )}
            </div>
            
            {authUser ? (
              <form onSubmit={handleAddComment} className="flex items-center gap-3">
                <img
                  src={authUser.profilePicture || "/avatar.png"}
                  alt={authUser.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1 flex items-center bg-gray-50 rounded-full overflow-hidden
                              focus-within:ring-2 focus-within:ring-blue-500/30 transition-all duration-300">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-grow px-5 py-3 bg-transparent focus:outline-none text-gray-700
                             placeholder-gray-500"
                    aria-label="Write a comment"
                    disabled={isAddingComment}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isAddingComment || !newComment.trim()}
                    className="bg-blue-600 text-white p-3 hover:bg-blue-700 transition-all duration-300 
                             flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed
                             transform hover:scale-105"
                    aria-label="Submit comment"
                  >
                    {isAddingComment ? 
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : 
                      <Send size={16} />
                    }
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">Join the conversation</p>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white 
                           rounded-full hover:bg-blue-700 transition-all duration-300 
                           transform hover:scale-105"
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
                   animate-fadeIn" 
          onClick={() => setShowShareModal(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="animate-scaleIn"
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
            className="absolute top-6 right-6 z-10 text-white hover:text-gray-300 
                     bg-black/50 p-3 rounded-full transition-all duration-300 
                     transform hover:scale-110"
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
            {(Array.isArray(post.image) ? post.image : [post.image]).map((imgUrl, idx) => (
              <SwiperSlide key={idx} className="flex items-center justify-center">
                <img 
                  src={imgUrl} 
                  alt="Full view" 
                  className="object-contain max-h-[95vh] max-w-[95vw] mx-auto animate-scaleIn" 
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>,
        document.body
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
          animation: fadeInUp 0.5s ease-out both;
        }
        
        .post-swiper .swiper-button-next,
        .post-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        
        .post-swiper .swiper-button-next:hover,
        .post-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }
        
        .post-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 1;
        }
        
        .post-swiper .swiper-pagination-bullet-active {
          background: white;
        }
        
        .fullscreen-swiper .swiper-button-next,
        .fullscreen-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.5);
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        
        .fullscreen-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
        }
        
        .fullscreen-swiper .swiper-pagination-bullet-active {
          background: white;
        }
      `}</style>
    </div>
  );
};

export default Post;