import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";



const NotificationsPage = () => {
  const queryClient = useQueryClient();

  // Local state for filters
  const [filter, setFilter] = useState("all");

  // ✅ Fetch authUser
  const { data: authUser, isLoading: isAuthLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  // ✅ Fetch notifications
  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications").then((res) => res.data),
  });

  // ✅ Mark as read
  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  // ✅ Mark All as Read
  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: () => axiosInstance.put("/notifications/read"),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications marked as read");
    },
  });

  // ✅ Delete notification
  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted");
    },
  });

  // ✅ Delete All Notifications
  const { mutate: deleteAllNotificationsMutation } = useMutation({
    mutationFn: () => axiosInstance.delete("/notifications"),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications deleted");
    },
  });

  // ✅ Icon Renderer
  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500" />;
      case "comment":
        return <MessageSquare className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" />;
      default:
        return null;
    }
  };

  // ✅ Content Renderer
  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span>
            <strong>{notification.relatedUser?.name || "Someone"}</strong> liked your post
          </span>
        );
      case "comment":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser?.username || "#"}`} className="font-bold">
              {notification.relatedUser?.name || "Someone"}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser?.username || "#"}`} className="font-bold">
              {notification.relatedUser?.name || "Someone"}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  // ✅ Related Post Renderer
  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-base-200 rounded-md flex items-center space-x-2 hover:bg-base-200 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-base-content/70 truncate">{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className="text-base-content/40" />
      </Link>
    );
  };

  // Filter Logic
  const filteredNotifications = notifications?.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    if (filter === "likes") return notification.type === "like";
    if (filter === "comments") return notification.type === "comment";
    if (filter === "connections") return notification.type === "connectionAccepted";
    return true;
  });

  // ✅ Loader while waiting for user or notifications
  if (isAuthLoading || isNotificationsLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex justify-center p-10">
        <p className="text-xl text-base-content/70 animate-pulse">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 bg-base-200 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-1 lg:block hidden">
        {authUser ? <Sidebar user={authUser} /> : <p>Loading user...</p>}
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-base-100 rounded-lg shadow-md p-4 sm:p-6 min-h-[500px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Notifications</h1>
            <div className="flex gap-2">
              <button
                onClick={() => markAllAsReadMutation()}
                className="text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors flex items-center gap-1 font-medium"
              >
                <Eye size={16} /> Mark all read
              </button>
              <button
                onClick={() => deleteAllNotificationsMutation()}
                className="text-sm px-3 py-1.5 bg-error/10 text-error rounded-md hover:bg-error/20 transition-colors flex items-center gap-1 font-medium"
              >
                <Trash2 size={16} /> Delete all
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6 border-b pb-2">
            {["all", "unread", "read", "likes", "comments", "connections"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`text-sm px-4 py-2 rounded-full transition-colors capitalize ${filter === type
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content/70 hover:bg-base-300"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {Array.isArray(filteredNotifications) && filteredNotifications.length > 0 ? (
            <ul>
              {filteredNotifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-base-100 border rounded-lg p-4 my-4 transition-all hover:shadow-md ${!notification.read ? "border-blue-500 border-l-4" : "border-base-300"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <Link to={`/profile/${notification.relatedUser?.username || "#"}`} className="flex-shrink-0">
                      <img
                        src={notification.relatedUser?.profilePicture || "/avatar.png"}
                        alt={notification.relatedUser?.name || "User"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <div className="p-1 bg-base-200 rounded-full flex-shrink-0">
                          {renderNotificationIcon(notification.type)}
                        </div>
                        <div className="text-sm text-base-content flex-1">
                          {renderNotificationContent(notification)}
                          <span className="text-xs text-base-content/60 ml-2 block sm:inline">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      {renderRelatedPost(notification.relatedPost)}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 self-start sm:self-center">
                      {!notification.read && (
                        <button
                          onClick={() => markAsReadMutation(notification._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Mark as read"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotificationMutation(notification._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-base-content/60">
              <MessageSquare size={48} className="mb-4 text-base-content/20" />
              <p className="text-lg">No notifications found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
