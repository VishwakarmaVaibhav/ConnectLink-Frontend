// src/pages/PostPage.jsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Post from "../components/Post";
import { Loader } from "lucide-react";

const PostPage = () => {
  const { postId } = useParams();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/${postId}`);
      return res.data;
    },
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="text-center text-red-600 mt-10">
        Failed to load the post. It may have been deleted.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Post post={post} authUser={authUser} />
    </div>
  );
};

export default PostPage;
