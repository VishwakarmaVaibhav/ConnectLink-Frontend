import { Navigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
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
import { Helmet } from "react-helmet-async";

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

  // LANDING PAGE FOR GUESTS
  if (!authUser) {
    return (
      <div className="bg-base-200 min-h-screen">
        <Helmet>
          <title>ConnectLink | Build Your Professional Network</title>
          <meta name="description" content="ConnectLink is the professional network for students, alumni, and mentors. Build your career, share your journey, and find your dream path." />
        </Helmet>
        {/* Hero Section */}
        <div className="bg-base-100 border-b border-base-300">
          <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-extrabold text-base-content leading-tight">
                Connect with your <span className="text-primary">Future</span>
              </h1>
              <p className="text-xl text-base-content/70 max-w-lg">
                ConnectLink is the professional network for students, alumni, and mentors. Build your career, share your journey, and find your dream path.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="/signup" className="bg-primary text-primary-content px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-focus transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Get Started
                </a>
                <a href="/login" className="bg-base-100 text-base-content border border-base-300 px-8 py-3 rounded-full font-bold text-lg hover:bg-base-200 transition-all">
                  Log In
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-70"></div>
              <img src="/hero.png" alt="Networking" className="relative rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 border-4 border-white" onError={(e) => e.target.style.display = 'none'} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center" style={{ display: 'none' }}> {/* Fallback if image fails */}
                <Users size={120} className="text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts Section */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content">Trending on ConnectLink</h2>
            <p className="text-base-content/60 mt-2">See what the community is talking about</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(randomPosts || []).slice(0, 6).map((post) => (
              <ErrorBoundary key={post._id}>
                <div className="bg-base-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-base-300">
                  <div className="p-4 flex items-center gap-3 border-b border-base-300">
                    <img src={post.author?.profilePicture || "/avatar.png"} alt={post.author?.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h3 className="font-semibold text-sm text-base-content">{post.author?.name}</h3>
                      <p className="text-xs text-base-content/60 line-clamp-1">{post.author?.headline}</p>
                    </div>
                  </div>
                  {post.image && post.image.length > 0 && (
                    <div className="h-48 bg-base-200 overflow-hidden">
                      <img src={post.image[0]} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-base-content/80 text-sm line-clamp-3 mb-4">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-base-content/60 pt-3 border-t border-base-300">
                      <span>{post.likes?.length || 0} Likes</span>
                      <span>{post.comments?.length || 0} Comments</span>
                    </div>
                  </div>
                </div>
              </ErrorBoundary>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/signup" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline text-lg">
              Join to see more <Users size={20} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED FEED
  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 pb-20 bg-base-200">
      {/* Sidebar */}
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser} />
      </div>

      {/* Main Feed */}
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
        {(isPostsLoading || (posts?.length < 5 && isRandomLoading)) ? (
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="animate-pulse bg-base-100 rounded-xl shadow-md p-5 space-y-4">
                <div className="h-4 w-1/4 bg-base-300 rounded"></div>
                <div className="h-4 w-full bg-base-300 rounded"></div>
                <div className="h-4 w-5/6 bg-base-300 rounded"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : combinedPosts.length > 0 ? (
          <Virtuoso
            useWindowScroll
            data={combinedPosts}
            className="w-full"
            itemContent={(index, post) => (
              <div className="mb-4">
                <ErrorBoundary key={post._id}>
                  <Post post={post} authUser={authUser} />
                  {index === 1 && (
                    <div className="block lg:hidden my-4">
                      {!isTrendingLoading && trendingNews && (
                        <TrendingNews articles={trendingNews} />
                      )}
                    </div>
                  )}
                </ErrorBoundary>
              </div>
            )}
            components={{
              Header: () => (
                <div className="space-y-6 mb-6">
                  {authUser && <PostCreation user={authUser} />}
                  {isProfileIncomplete && <CompleteProfileReminder user={authUser} />}
                </div>
              ),
              Footer: () => (
                <div className="py-8 text-center text-base-content/60 text-sm">
                  You've reached the end of the feed
                </div>
              )
            }}
          />
        ) : (
          <div className="space-y-6">
            {authUser && <PostCreation user={authUser} />}
            {isProfileIncomplete && <CompleteProfileReminder user={authUser} />}
            <div className="bg-base-100 rounded-xl shadow p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-base-content">No Posts Yet</h2>
              <p className="text-base-content/60">Connect with others to start seeing posts in your feed!</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="col-span-1 lg:col-span-1 hidden lg:block h-fit sticky top-24 space-y-6">
        {recommendedUsers?.length > 0 && (
          <div className="bg-base-100 rounded-xl shadow p-5">
            <h2 className="text-lg font-semibold mb-4 text-base-content">👥 People You May Know</h2>
            <div className="space-y-4">
              {recommendedUsers.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-base-100 rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-4 text-base-content">📰 Trending News</h2>
          {isTrendingLoading ? (
            <p className="text-sm text-base-content/60">Fetching news...</p>
          ) : trendingNews?.articles?.length ? (
            <TrendingNews articles={trendingNews.articles} />
          ) : (
            <p className="text-sm text-base-content/60">No trending news available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;