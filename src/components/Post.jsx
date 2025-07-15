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
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";

const Post = ({ post, authUser }) => {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [showShareModal, setShowShareModal] = useState(false);


  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post?.comments ?? []);

  if (!post || !post.author) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader size={24} className="animate-spin text-primary" />
      </div>
    );
  }
  
  useEffect(() => {
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
    <article className="bg-white rounded-lg shadow-md border border-gray-200 mb-6 overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.author.username}`} aria-label={`${post.author.name}'s profile`}>
              <img
                src={post.author.profilePicture || "/avatar.png"}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
              />
            </Link>
            <div>
              <Link to={`/profile/${post.author.username}`}>
                <h3 className="font-semibold text-gray-800 hover:underline">{post.author.name}</h3>
              </Link>
              <p className="text-sm text-gray-500">{post.author.headline}</p>
              <time
                dateTime={new Date(post.createdAt).toISOString()}
                className="text-xs text-gray-400"
                title={new Date(post.createdAt).toLocaleString()}
              >
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-gray-400 hover:text-red-500 transition"
              aria-label="Delete Post"
              disabled={isDeletingPost}
            >
              {isDeletingPost ? <Loader size={18} className="animate-spin" /> : <Trash2 size={18} />}
            </button>
          )}
        </header>

        {/* Content */}
        {post.content && <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.content}</p>}

        {/* Project Link */}
        {post.projectLink && (
          <div className="mb-4">
            <a
              href={post.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-600 hover:underline font-medium"
            >
              🔗 View Project
            </a>
          </div>
        )}

        {/* Images */}
        {Array.isArray(post.image) && post.image.length > 0 ? (
          <div className="my-4 rounded-lg overflow-hidden">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="rounded-lg"
              style={{ height: "auto", width: "100%" }}
              grabCursor
            >
              {post.image.map((imgUrl, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={imgUrl}
                    alt={`Post image ${idx + 1}`}
                    className="w-full max-h-[600px] object-contain rounded-lg"
                    loading="lazy"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : typeof post.image === "string" ? (
          <div className="my-4">
            <img
              src={post.image}
              alt="Post content"
              className="rounded-lg w-full h-auto object-contain max-h-[600px]"
              loading="lazy"
            />
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex justify-around text-gray-500 border-t border-gray-200 pt-2 mt-2">
          <PostAction
            icon={<ThumbsUp size={18} className={isLiked ? "text-blue-600 fill-blue-100" : ""} />}
            text={`Like (${Array.isArray(post.likes) ? post.likes.length : 0})`}
            onClick={handleLikePost}
            disabled={isLikingPost}
          />
          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${Array.isArray(comments) ? comments.length : 0})`}
            onClick={() => setShowComments((prev) => !prev)}
          />
         <PostAction
            icon={<Share2 size={18} />}
            text="Share"
            onClick={handleSharePost}
          />

        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <section className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {!Array.isArray(comments) || comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet.</p>
            ) : (
              comments.map(({ _id, content, user, createdAt }) => (
                <article key={_id} className="flex items-start space-x-3 mb-3">
                  <img
                    src={user?.profilePicture || "/avatar.png"}
                    alt={user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="bg-gray-100 p-3 rounded-lg w-full">
                    <header className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-700">{user?.name}</h4>
                      <time
                        dateTime={new Date(createdAt).toISOString()}
                        className="text-xs text-gray-400"
                        title={new Date(createdAt).toLocaleString()}
                      >
                        {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                      </time>
                    </header>
                    <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Comment Form */}
          {authUser ? (
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-grow px-4 py-2 bg-gray-100 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                aria-label="Write a comment"
                disabled={isAddingComment}
                required
              />
              <button
                type="submit"
                disabled={isAddingComment}
                className="bg-blue-600 text-white p-2 rounded-r-full hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                aria-label="Submit comment"
              >
                {isAddingComment ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          ) : (
            <p className="text-sm text-center text-gray-500 mt-3">
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link> to comment.
            </p>
          )}
        </section>
      )}
    </article>
    {showShareModal &&
  createPortal(
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center"
      onClick={() => setShowShareModal(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ShareModal postId={post._id} /> {/* ✅ Pass the postId here */}
      </div>
    </div>,
    document.body
  )}

</div>    
  );
};

export default Post;
