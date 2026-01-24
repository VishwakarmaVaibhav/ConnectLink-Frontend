import { useMemo } from "react";
import { Award, ThumbsUp, MessageCircle, Users } from "lucide-react";

const ProfileAnalytics = ({ userData, userPosts = [] }) => {
    const profileStrength = useMemo(() => {
        let score = 0;
        const totalChecks = 7;

        if (userData.profilePicture) score++;
        if (userData.bannerImg) score++;
        if (userData.headline) score++;
        if (userData.about) score++;
        if (userData.location) score++;
        if (userData.experience && userData.experience.length > 0) score++;
        if (userData.skills && userData.skills.length > 0) score++;

        return Math.round((score / totalChecks) * 100);
    }, [userData]);

    const totalLikes = useMemo(() => {
        return userPosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0);
    }, [userPosts]);

    const totalComments = useMemo(() => {
        return userPosts.reduce((acc, post) => acc + (post.comments?.length || 0), 0);
    }, [userPosts]);

    return (
        <div className="bg-base-100 rounded-xl shadow-sm p-4 md:p-6 mb-6 transition-all duration-300 hover:shadow-md">
            <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                <Award className="text-yellow-500" size={20} />
                Profile Analytics
            </h3>

            <div className="space-y-6">
                {/* Profile Strength */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-base-content/70">Profile Strength</span>
                        <span className={`text-sm font-bold ${profileStrength === 100 ? 'text-green-600' :
                                profileStrength >= 70 ? 'text-blue-600' : 'text-orange-500'
                            }`}>
                            {profileStrength}%
                        </span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${profileStrength === 100 ? 'bg-green-500' :
                                    profileStrength >= 70 ? 'bg-blue-500' : 'bg-orange-400'
                                }`}
                            style={{ width: `${profileStrength}%` }}
                        />
                    </div>
                    {profileStrength < 100 && (
                        <p className="text-xs text-base-content/60 mt-2 italic">
                            Tip: Add more details to reach 100%
                        </p>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="flex justify-center mb-1">
                            <ThumbsUp size={18} className="text-blue-500" />
                        </div>
                        <p className="text-xl font-bold text-base-content">{totalLikes}</p>
                        <p className="text-xs text-base-content/60 uppercase tracking-wide">Total Likes</p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg text-center">
                        <div className="flex justify-center mb-1">
                            <MessageCircle size={18} className="text-purple-500" />
                        </div>
                        <p className="text-xl font-bold text-base-content">{totalComments}</p>
                        <p className="text-xs text-base-content/60 uppercase tracking-wide">Total Comments</p>
                    </div>

                    <div className="col-span-2 bg-base-200 p-3 rounded-lg flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-base-content/70" />
                            <span className="text-sm text-base-content/70">Connections</span>
                        </div>
                        <span className="font-bold text-base-content">{userData.connections?.length || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileAnalytics;
