import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, PlusCircle, Search, User, Users, X, Hash, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeStore } from "../../store/useThemeStore";


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [searchedUsers, setSearchedUsers] = useState([]);


  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const themes = ["light", "dark", "cupcake", "bumblebee", "black", "luxury"];

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: () => axiosInstance.get("/auth/me").then((res) => res.data),
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications").then((res) => res.data),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests").then((res) => res.data),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/login");
    },
  });

  const unreadNotificationCount = notifications?.filter((notif) => !notif.read).length || 0;
  const unreadConnectionRequestsCount = connectionRequests?.length || 0;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        axiosInstance.get("/search", { params: { query: searchQuery } })
          .then((res) => {
            setSearchResults(res.data);
            setShowResults(true);
          })
          .catch(() => {
            setSearchResults([]);
            setShowResults(false);
          });
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleUserClick = (user) => {
    if (user.type === 'user' || !user.type) {
      setRecentSearches((prev) => {
        const exists = prev.find((u) => u.username === user.username);
        if (exists) return prev;
        return [user, ...prev.slice(0, 4)];
      });
    }

    setSearchQuery("");
    setShowResults(false);
    setIsSearchFocused(false);
    setShowMobileSearch(false);
  };

  const authPaths = ["/login", "/signup", "/forgot-password"];
  const isAuthPath = authPaths.includes(location.pathname);

  return (
    <>
      {/* Background blur when search is active */}
      {isSearchFocused && authUser && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => {
            setIsSearchFocused(false);
            setShowResults(false);
            setShowMobileSearch(false);
          }}
        />
      )}

      <nav className="sticky top-0 z-50 border-b border-base-300 bg-base-100/80 backdrop-blur-md shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2 relative">
          {/* Logo and Mobile Search Button */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <img
                src="/small-logo.png"
                alt="ConnectLink Logo"
                className="h-14 w-auto object-cover object-center"
                style={{ objectFit: "cover", objectPosition: "center", paddingTop: "0px", paddingBottom: "0px" }}
              />
            </Link>
          </div>

          {/* Search Button (mobile only) */}
          {authUser && !isAuthPath && (
            <button
              className="md:hidden text-base-content/70 ml-auto"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              {showMobileSearch ? <X size={26} /> : <Search size={26} />}
            </button>
          )}

          {/* Center Search Bar (Desktop) */}
          {authUser && !isAuthPath && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-lg">
                <div className="flex items-center bg-base-200 px-4 py-2 rounded-full shadow-inner border border-transparent focus-within:border-primary focus-within:bg-base-100 transition-all duration-300">
                  <Search size={20} className="text-base-content/60" />
                  <input
                    type="text"
                    placeholder="Search users or posts..."
                    value={searchQuery}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowResults(true);
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent ml-2 outline-none w-full text-base text-base-content placeholder:text-base-content/50"
                  />
                </div>

                {/* Search Dropdown */}
                {showResults && (
                  <div className="absolute top-12 left-0 w-full bg-base-100 border border-base-300 rounded-xl shadow-xl max-h-80 overflow-y-auto z-50 p-2 animate-fadeIn">
                    {recentSearches.length > 0 && searchQuery.trim() === "" && (
                      <>
                        <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3 px-2 mt-2">Recent Searches</h4>
                        <div className="flex gap-3 overflow-x-auto pb-2 px-2 custom-scrollbar">
                          {recentSearches.map((user) => (
                            <Link
                              to={`/profile/${user.username}`}
                              key={user.username}
                              onClick={() => handleUserClick(user)}
                              className="flex flex-col items-center min-w-[60px] group"
                            >
                              <div className="relative">
                                <img
                                  src={user.profilePicture || "/default-avatar.png"}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover border border-base-200 group-hover:border-primary transition-colors"
                                />
                              </div>
                              <span className="text-xs mt-1 text-base-content/70 group-hover:text-primary truncate max-w-[60px]">{user.name.split(" ")[0]}</span>
                            </Link>
                          ))}
                        </div>
                        <hr className="my-3 border-base-200" />
                      </>
                    )}
                    <div>
                      {searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          result.type === "post" ? (
                            <Link
                              to={`/post/${result._id}`}
                              key={result._id}
                              onClick={() => {
                                setSearchQuery("");
                                setShowResults(false);
                                setIsSearchFocused(false);
                              }}
                              className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors group"
                            >
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 text-primary">
                                <Hash size={20} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-base-content line-clamp-1 group-hover:text-primary transition-colors">{result.content}</p>
                                <p className="text-xs text-base-content/50">Post by {result.author?.name}</p>
                              </div>
                            </Link>
                          ) : (
                            <Link
                              to={`/profile/${result.username}`}
                              key={result._id}
                              onClick={() => handleUserClick(result)}
                              className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors"
                            >
                              <img
                                src={result.profilePicture || "/default-avatar.png"}
                                alt={result.name}
                                className="w-10 h-10 rounded-full object-cover border border-base-200"
                              />
                              <div>
                                <p className="text-sm font-semibold text-base-content">{result.name}</p>
                                <p className="text-xs text-base-content/50 line-clamp-1">{result.headline || "ConnectLink User"}</p>
                              </div>
                            </Link>
                          )
                        ))
                      ) : (
                        <div className="p-4 text-center text-base-content/50">
                          <p className="text-sm">No results found</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
              {/* Desktop Right Icons */}
              {authUser ? (
                <div className="hidden md:flex items-center gap-6 ml-auto">
                  <Link to="/" className="text-base-content/70 hover:text-blue-600 p-2 rounded-full hover:bg-base-200 transition-colors">
                    <Home size={24} />
                  </Link>
                  <Link to="/network" className="relative text-base-content/70 hover:text-blue-600 p-2 rounded-full hover:bg-base-200 transition-colors">
                    <Users size={24} />
                    {unreadConnectionRequestsCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse border-2 border-white">
                        {unreadConnectionRequestsCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/notifications" className="relative text-base-content/70 hover:text-blue-600 p-2 rounded-full hover:bg-base-200 transition-colors">
                    <Bell size={24} />
                    {unreadNotificationCount > 0 && (
                      <span className="absolute top-0 right-0 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse border-2 border-white">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </Link>
                  <Link to={`/profile/${authUser.username}`} className="flex flex-col items-center group">
                    <img
                      src={authUser.profilePicture || "/default-avatar.png"}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover border border-base-300 group-hover:border-blue-500 transition-colors"
                    />

                  </Link>



                  <button
                    onClick={() => logout()}
                    className="text-base-content/60 hover:text-error transition-colors"
                    title="Logout"
                  >
                    <LogOut size={24} />
                  </button>
                </div>
              ) : (
                !isAuthPath && (
                  <div className="hidden md:flex items-center gap-4 ml-auto">
                    <Link to="/login" className="text-base-content/70 hover:text-blue-600 font-medium">Log In</Link>
                    <Link to="/signup" className="px-5 py-2.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 font-medium transition-all shadow-md hover:shadow-lg">Join Now</Link>
                  </div>
                )
              )}

            </div>
          )}
        </div>

        {/* Mobile Search Input - Moved INSIDE Sticky Nav */}
        {showMobileSearch && (
          <div className="px-4 py-3 bg-base-100 border-t border-base-200 md:hidden animate-slideDown">
            <div className="flex items-center bg-base-200 px-4 py-2 rounded-full shadow-inner border border-transparent focus-within:border-primary focus-within:bg-base-100 transition-all">
              <Search size={20} className="text-base-content/50" />
              <input
                type="text"
                placeholder="Search users or posts..."
                value={searchQuery}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowResults(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (searchResults.length > 0) {
                      setSearchQuery("");
                      setShowResults(false);
                      setShowMobileSearch(false);
                      navigate(`/search`);
                    }
                  }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent ml-2 outline-none w-full text-base"
                autoFocus
              />
            </div>
          </div>
        )}
        {showMobileSearch && showResults && (
          <div className="px-4 pb-3 bg-base-100 border-b border-base-200 shadow-sm md:hidden">
            <div className="bg-base-100 border border-base-200 rounded-lg shadow-md max-h-80 overflow-y-auto z-40 p-2">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  result.type === "post" ? (
                    <Link
                      to={`/post/${result._id}`}
                      key={result._id}
                      onClick={() => {
                        setSearchQuery("");
                        setShowResults(false);
                        setShowMobileSearch(false);
                      }}
                      className="flex items-start gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 text-blue-600">
                        <Hash size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-base-content line-clamp-1 group-hover:text-blue-600 transition-colors">{result.content}</p>
                        <p className="text-xs text-base-content/60">Post by {result.author?.name}</p>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to={`/profile/${result.username}`}
                      key={result._id}
                      onClick={() => handleUserClick(result)}
                      className="flex items-center gap-3 p-3 hover:bg-base-200 rounded-lg transition-colors"
                    >
                      <img
                        src={result.profilePicture || "/default-avatar.png"}
                        alt={result.name}
                        className="w-8 h-8 rounded-full object-cover border border-base-300"
                      />
                      <div>
                        <p className="text-sm font-semibold text-base-content">{result.name}</p>
                        <p className="text-xs text-base-content/60">{result.headline}</p>
                      </div>
                    </Link>
                  )
                ))
              ) : (
                <div className="p-4 text-center text-base-content/60">
                  <p className="text-sm">No results found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>


      {/* Mobile Bottom Nav */}
      {authUser && !isAuthPath && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-base-100/90 backdrop-blur-md border-t border-base-200 p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe transition-all duration-300">
          <Link to="/" className="text-base-content/60 hover:text-blue-600 flex flex-col items-center group transition-colors">
            <Home size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] mt-1 font-medium">Home</span>
          </Link>
          <Link to="/network" className="text-base-content/60 hover:text-blue-600 flex flex-col items-center relative group transition-colors">
            <Users size={24} className="group-hover:scale-110 transition-transform" />
            {unreadConnectionRequestsCount > 0 && (
              <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse border-2 border-white">
                {unreadConnectionRequestsCount}
              </span>
            )}
            <span className="text-[10px] mt-1 font-medium">Network</span>
          </Link>

          {/* Create Post Center Button */}
          <Link
            to="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault(); // stop reloading the page
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center -mt-8 border-4 border-base-300 transition-all active:scale-95"
          >
            <PlusCircle size={28} />
          </Link>



          <Link to="/notifications" className="text-base-content/60 hover:text-blue-600 flex flex-col items-center relative group transition-colors">
            <Bell size={24} className="group-hover:scale-110 transition-transform" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0 right-2 bg-green-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse border-2 border-white">
                {unreadNotificationCount}
              </span>
            )}
            <span className="text-[10px] mt-1 font-medium">Alerts</span>
          </Link>
          <Link to={`/profile/${authUser.username}`} className="flex flex-col items-center group">
            <div className="rounded-full p-0.5 group-hover:bg-blue-500 transition-colors">
              <img
                src={authUser.profilePicture || "/default-avatar.png"}
                alt="Profile"
                className="w-6 h-6 rounded-full object-cover border border-base-300 group-hover:border-white transition-colors"
              />
            </div>
            <span className="text-[10px] mt-1 font-medium text-base-content/60 group-hover:text-blue-600">Me</span>
          </Link>

        </div>
      )}
    </>
  );
};

export default Navbar;
