import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, PlusCircle, Search, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";


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
            setSearchResults(res.data.users);
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
    setRecentSearches((prev) => {
      const exists = prev.find((u) => u.username === user.username);
      if (exists) return prev;
      return [user, ...prev.slice(0, 4)];
    });

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
          className="fixed inset-0 bg-grey bg-opacity-20 backdrop-blur-sm z-30"
          onClick={() => {
            setIsSearchFocused(false);
            setShowResults(false);
            setShowMobileSearch(false);
          }}
        />
      )}

      <nav className="bg-white sticky top-0 z-50 border-b shadow-sm">
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
              className="md:hidden text-gray-600 ml-auto"
              onClick={() => setShowMobileSearch((prev) => !prev)}
            >
              {showMobileSearch ? <X size={26} /> : <Search size={26} />}
            </button>
          )}

          {/* Center Search Bar (Desktop) */}
          {authUser && !isAuthPath && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-lg">
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full shadow-inner">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setShowResults(true);
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent ml-2 outline-none w-full text-base"
                  />
                </div>

                {/* Search Dropdown */}
                {showResults && (
                  <div className="absolute top-12 left-0 w-full bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 p-3">
                    {recentSearches.length > 0 && searchQuery.trim() === "" && (
                      <>
                        <h4 className="text-xs text-gray-400 mb-2">Recent Searches</h4>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                          {recentSearches.map((user) => (
                            <Link
                              to={`/profile/${user.username}`}
                              key={user.username}
                              onClick={() => handleUserClick(user)}
                              className="flex flex-col items-center min-w-[60px] hover:text-blue-500"
                            >
                              <img
                                src={user.profilePicture || "/default-avatar.png"}
                                alt={user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <span className="text-xs mt-1">{user.name.split(" ")[0]}</span>
                            </Link>
                          ))}
                        </div>
                        <hr className="my-3" />
                      </>
                    )}
                    <div>
                      {searchResults.length > 0 ? (
                        searchResults.map((user) => (
                          <Link
                            to={`/profile/${user.username}`}
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
                          >
                            <img
                              src={user.profilePicture || "/default-avatar.png"}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-semibold">{user.name}</p>
                              <p className="text-xs text-gray-400">{user.headline}</p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400">No users found</p>
                      )}
                    </div>
                  </div>
                )}
				
              </div>
			  {/* Desktop Right Icons */}
{authUser && !isAuthPath && (
  <div className="hidden md:flex items-center gap-6 ml-auto">
    <Link to="/" className="text-gray-600 hover:text-blue-600">
      <Home size={24} />
    </Link>
    <Link to="/network" className="relative text-gray-600 hover:text-blue-600">
      <Users size={24} />
      {unreadConnectionRequestsCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          {unreadConnectionRequestsCount}
        </span>
      )}
    </Link>
    <Link to="/notifications" className="relative text-gray-600 hover:text-blue-600">
      <Bell size={24} />
      {unreadNotificationCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
          {unreadNotificationCount}
        </span>
      )}
    </Link>
    <Link to={`/profile/${authUser.username}`} className="flex flex-col items-center">
  <img
    src={authUser.profilePicture || "/default-avatar.png"}
    alt="Profile"
    className="w-6 h-6 rounded-full object-cover border border-gray-300"
  />
  
</Link>

    <button
      onClick={() => logout()}
      className="text-gray-600 hover:text-red-500"
      title="Logout"
    >
      <LogOut size={24} />
    </button>
  </div>
)}

            </div>
          )}
        </div>

        {/* Mobile Search Input */}
        {showMobileSearch && (
          <div className="px-4 py-3">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full shadow-inner">
              <Search size={20} className="text-gray-400" />
              <input
  type="text"
  placeholder="Search users..."
  value={searchQuery}
  onFocus={() => {
    setIsSearchFocused(true);
    setShowResults(true);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0) {
        const newUsers = searchResults.filter(
          (user) => !searchedUsers.some((u) => u._id === user._id)
        );
        setSearchedUsers([...searchedUsers, ...newUsers]);
        setSearchQuery("");
        setShowResults(false);
        setShowMobileSearch(false);
      }
    }
  }}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="bg-transparent ml-2 outline-none w-full text-base"
/>

            </div>
          </div>
        )}
        {showMobileSearch && showResults && (
  <div className="px-4 pb-3">
    <div className="bg-white border rounded-lg shadow-md max-h-80 overflow-y-auto z-40 p-3">
      {searchResults.length > 0 ? (
        searchResults.map((user) => (
          <Link
            to={`/profile/${user.username}`}
            key={user._id}
            onClick={() => handleUserClick(user)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-md"
          >
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.headline}</p>
            </div>
          </Link>
        ))
      ) : (
        <p className="text-sm text-gray-400">No users found</p>
      )}
    </div>
  </div>
)}


        {/* Mobile Bottom Nav */}
        {authUser && !isAuthPath && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-around items-center bg-white border-t p-2 shadow-md md:hidden z-40">
            <Link to="/" className="text-gray-500 hover:text-blue-600 flex flex-col items-center">
              <Home size={24} />
              <span className="text-[10px]">Home</span>
            </Link>
            <Link to="/network" className="text-gray-500 hover:text-blue-600 flex flex-col items-center relative">
              <Users size={24} />
              {unreadConnectionRequestsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadConnectionRequestsCount}
                </span>
              )}
              <span className="text-[10px]">Network</span>
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
  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md flex items-center justify-center -mt-8"
>
  <PlusCircle size={28} />
</Link>



            <Link to="/notifications" className="text-gray-500 hover:text-blue-600 flex flex-col items-center relative">
              <Bell size={24} />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
              <span className="text-[10px]">Alerts</span>
            </Link>
            <Link to={`/profile/${authUser.username}`} className="flex flex-col items-center">
  <img
    src={authUser.profilePicture || "/default-avatar.png"}
    alt="Profile"
    className="w-6 h-6 rounded-full object-cover border border-gray-300"
  />
  <span className="text-[10px] text-gray-500 hover:text-blue-600">Me</span>
</Link>

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
