import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";



const NotificationsPage = () => {
  const queryClient = useQueryClient();

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

  // ✅ Delete notification
  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted");
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
        className="mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 truncate">{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
      </Link>
    );
  };

  // ✅ Loader while waiting for user or notifications
  if (isAuthLoading || isNotificationsLoading) {
    return <p className="p-4">Loading...</p>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-1">
        {authUser ? <Sidebar user={authUser} /> : <p>Loading user...</p>}
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>

          {Array.isArray(notifications) && notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                    !notification.read ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <div className="flex flex-wrap items-start sm:items-center justify-between gap-4 w-full">
                    {/* Left Part */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      <Link to={`/profile/${notification.relatedUser?.username || "#"}`}>
                        <img
                          src={notification.relatedUser?.profilePicture || "/avatar.png"}
                          alt={notification.relatedUser?.name || "User"}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="p-1 bg-gray-100 rounded-full">
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className="text-sm break-words">
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>

                    {/* Right Part - Actions */}
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsReadMutation(notification._id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          aria-label="Mark as read"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotificationMutation(notification._id)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
