import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import TrendingNews from "../components/TrendingNews";
import CompleteProfileReminder from "../components/CompleteProfileReminder";
import ErrorBoundary from "../components/ErrorBoundary";

const HomePage = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    },
  });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  const { data: randomPosts, isLoading: isRandomLoading } = useQuery({
    queryKey: ["randomPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts/random");
      return res.data;
    },
    enabled: !!posts && posts.length < 5,
  });

  const { data: trendingNews, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trendingNews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/news/trending");
      return res.data;
    },
  });

  const combinedPosts = (() => {
    let result = [];
    if (!posts?.length && randomPosts?.length) {
      result = randomPosts;
    } else if (posts?.length && randomPosts?.length) {
      const limit = Math.floor(posts.length * 0.2);
      result = [...posts, ...randomPosts.slice(0, limit)];
    } else {
      result = posts || [];
    }
    return result.filter((post) => post && post._id && post.author && post.author._id);
  })();

  const isProfileIncomplete = authUser && (!authUser.about || !authUser.profilePicture || !authUser.location || !authUser.domain);

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      {/* Main Feed */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
        <PostCreation user={authUser} />
        {isProfileIncomplete && <CompleteProfileReminder user={authUser} />}

        {(isPostsLoading || (posts?.length < 5 && isRandomLoading)) ? (
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl shadow-md p-5 space-y-4">
                <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-full bg-gray-300 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          combinedPosts.length > 0 ? (
            combinedPosts.map((post, idx) => (
              <ErrorBoundary key={post._id}>
                <Post post={post} authUser={authUser} />
                {idx === 1 && (
                  <div className="block lg:hidden my-4">
                    {!isTrendingLoading && trendingNews && (
                      <TrendingNews articles={trendingNews} />
                    )}
                  </div>
                )}
              </ErrorBoundary>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">No Posts Yet</h2>
              <p className="text-gray-600">Connect with others to start seeing posts in your feed!</p>
            </div>
          )
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-1 lg:col-span-1 hidden lg:block h-fit sticky top-24 space-y-6">
        {recommendedUsers?.length > 0 && (
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">👥 People You May Know</h2>
            <div className="space-y-4">
              {recommendedUsers.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">📰 Trending News</h2>
          {isTrendingLoading ? (
            <p className="text-sm text-gray-500">Fetching news...</p>
          ) : trendingNews?.articles?.length ? (
            <TrendingNews articles={trendingNews.articles} />
          ) : (
            <p className="text-sm text-gray-500">No trending news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;