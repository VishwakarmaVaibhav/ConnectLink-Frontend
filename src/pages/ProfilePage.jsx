import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import SocialLinksSection from "../components/SocialLinksSection";
import MiniProjectsSection from "../components/MiniProjectsSection";
import LocationDomainSection from "../components/LocationDomainSection";
import RecentPostsSection from "../components/RecentPostsSection";
import ThemeToggle from "../components/ThemeToggle";
import ProfileAnalytics from "../components/ProfileAnalytics";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState("posts");

	// Queries
	const { data: authUser, isLoading: isAuthUserLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: () => axiosInstance.get(`/auth/user/${username}`),
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

	const { data: userPosts, isLoading: isPostsLoading } = useQuery({
		queryKey: ["userPosts", username],
		queryFn: () => axiosInstance.get(`/posts/user/${username}`),
		enabled: !!userProfile,
	});

	// Mutations
	const { mutate: logout } = useMutation({
		mutationFn: () => axiosInstance.post("/auth/logout"),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
			toast.success("Logged out successfully!");
			window.location.href = "/login";
		},
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	// Delete Profile Mutation
	const { mutate: deleteProfile } = useMutation({
		mutationFn: async () => {
			await axiosInstance.delete(`/users/profile`);
		},
		onSuccess: () => {
			toast.success("Profile deleted successfully.");
			window.location.href = "/login";
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message || "Failed to delete profile.");
		},
	});


	// Loader
	if (isAuthUserLoading || isUserProfileLoading || isPostsLoading) {
		return (
			<div className="bg-base-200 min-h-screen flex items-center justify-center px-4">
				<div className="max-w-3xl w-full bg-base-100 rounded-lg shadow p-6">
					<SkeletonLoader />
				</div>
			</div>
		);
	}

	// Logic
	const isOwnProfile =
		authUser?.username && userProfile?.data?.username
			? authUser.username === userProfile.data.username
			: false;

	const userData = isOwnProfile ? authUser : userProfile?.data;

	const handleSave = (updatedData) => updateProfile(updatedData);

	// Logout/Delete profile component
	const ProfileActionsCard = ({ onLogout, onDeleteProfile }) => {
		const handleDelete = () => {
			const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action is irreversible.");
			if (confirmDelete) {
				onDeleteProfile();
			}
		};

		return (
			<div className="bg-base-100 rounded-xl shadow-md p-4 text-base-content space-y-4">
				<p className="font-medium text-lg text-error">Account Settings</p>
				<p className="text-sm text-base-content/70 leading-relaxed">
					Here you can manage your account actions like logging out or permanently deleting your profile.
				</p>
				<div className="space-y-3">
					<button
						onClick={onLogout}
						className="w-full bg-error hover:bg-error/80 text-white font-semibold py-2 px-4 rounded-full shadow-sm transition-transform active:scale-95"
					>
						Logout
					</button>
					<button
						onClick={handleDelete}
						className="w-full bg-base-200 hover:bg-base-300 text-error font-medium py-2 px-4 rounded-full transition-transform active:scale-95 text-sm"
					>
						Delete Profile
					</button>
				</div>
			</div>
		);
	};

	const renderTabContent = () => {
		switch (activeTab) {
			case "posts":
				return (
					<RecentPostsSection
						posts={userPosts?.data || []}
						isOwnProfile={isOwnProfile}
						refetchPosts={() => queryClient.invalidateQueries(["userPosts", username])}
					/>
				);
			case "about":
			default:
				return (
					<div className="space-y-6">
						<SectionWrapper>
							<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>

						<SectionWrapper>
							<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>

						<SectionWrapper>
							<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>

						<SectionWrapper>
							<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>

						<SectionWrapper>
							<LocationDomainSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>

						<SectionWrapper>
							<SocialLinksSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>
						<SectionWrapper>
							<MiniProjectsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</SectionWrapper>
					</div>
				);
		}
	};

	// JSX Return
	return (
		<div className="bg-base-200 min-h-screen">
			{userData && (
				<Helmet>
					<title>{`${userData.name} | ConnectLink`}</title>
					<meta name="description" content={userData.headline || `View ${userData.name}'s profile on ConnectLink`} />
				</Helmet>
			)}
			{/* Header Area */}
			<div className="max-w-screen-xl mx-auto px-0 md:px-6 md:py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Left Column - Main Profile */}
					<div className="lg:col-span-3">
						{/* Profile Header is always visible */}
						<div className="bg-base-100 md:rounded-2xl shadow-sm mb-4 md:mb-6 overflow-hidden">
							<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
						</div>

						{/* Analytics - Shown below header on all devices if it's own profile */}
						{isOwnProfile && <ProfileAnalytics userData={userData} userPosts={userPosts?.data || []} />}

						{/* Mobile Tabs */}
						<div className="flex md:hidden sticky top-[60px] z-10 bg-base-100 shadow-sm mb-4 border-b border-base-200">
							<button
								onClick={() => setActiveTab("posts")}
								className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "posts" ? "border-primary text-primary" : "border-transparent text-base-content/60"
									}`}
							>
								Posts
							</button>
							<button
								onClick={() => setActiveTab("about")}
								className={`flex-1 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "about" ? "border-primary text-primary" : "border-transparent text-base-content/60"
									}`}
							>
								About
							</button>
						</div>

						{/* Desktop Logic: Show everything. Mobile Logic: Show based on activeTab */}
						<div className="hidden md:block space-y-6">
							<div className="space-y-6">
								{/* Desktop Layout is usually Header -> Analytics -> About -> Exp -> Posts */}
								<SectionWrapper>
									<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<LocationDomainSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<SocialLinksSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<MiniProjectsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
								</SectionWrapper>
								<SectionWrapper>
									<RecentPostsSection
										posts={userPosts?.data || []}
										isOwnProfile={isOwnProfile}
										refetchPosts={() => queryClient.invalidateQueries(["userPosts", username])}
									/>
								</SectionWrapper>
							</div>
						</div>

						<div className="block md:hidden px-2 pb-20">
							{renderTabContent()}
						</div>

						{/* Mobile: Profile Actions */}
						{isOwnProfile && (
							<div className="lg:hidden px-4 mt-6 space-y-6">
								{/* Settings Section Mobile */}
								<div className="bg-base-100 rounded-xl shadow-md p-4 space-y-4">
									<h3 className="font-semibold text-base-content">Settings</h3>
									<div className="flex items-center justify-between">
										<span className="text-base-content/70">Appearance</span>
										<ThemeToggle />
									</div>
								</div>

								<ProfileActionsCard onLogout={logout} onDeleteProfile={deleteProfile} />
							</div>
						)}
					</div>

					{/* Right Sidebar */}
					<div className="hidden lg:block col-span-1">
						<div className="sticky top-28 space-y-6">
							<div className="bg-base-100 rounded-xl shadow-md p-4 text-base-content/70 text-sm">
								<p className="font-semibold text-base-content mb-2">Want to improve your profile?</p>
								<ul className="list-disc list-inside text-base-content/70 text-sm">
									<li>Fill in your experiences</li>
									<li>List your skills</li>
									<li>Add a professional profile picture</li>
								</ul>
							</div>

							{/* Settings Section */}
							<div className="bg-base-100 rounded-xl shadow-md p-4 space-y-4">
								<h3 className="font-semibold text-base-content">Settings</h3>
								<div className="flex items-center justify-between">
									<span className="text-base-content/70">Appearance</span>
									<ThemeToggle />
								</div>
							</div>

							{/* Desktop: Profile Actions */}
							{isOwnProfile && <ProfileActionsCard onLogout={logout} onDeleteProfile={deleteProfile} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

// Helper Section Wrapper
const SectionWrapper = ({ children }) => (
	<div className="bg-base-100 rounded-2xl shadow-sm p-4 md:p-6">{children}</div>
);

// Loader while fetching data
const SkeletonLoader = () => (
	<div className="space-y-4 animate-pulse">
		<div className="bg-base-300 h-6 w-2/3 rounded" />
		<div className="bg-base-300 h-40 rounded" />
		<div className="bg-base-300 h-6 w-1/2 rounded" />
		<div className="bg-base-300 h-6 w-full rounded" />
		<div className="bg-base-300 h-40 rounded" />
		<div className="bg-base-300 h-6 w-3/4 rounded" />
	</div>
);

export default ProfilePage;
