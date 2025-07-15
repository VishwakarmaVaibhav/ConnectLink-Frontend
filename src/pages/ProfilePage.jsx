import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import SocialLinksSection from "../components/SocialLinksSection";
import MiniProjectsSection from "../components/MiniProjectsSection";
import LocationDomainSection from "../components/LocationDomainSection";
import RecentPostsSection from "../components/RecentPostsSection";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

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

	// Loader
	if (isAuthUserLoading || isUserProfileLoading || isPostsLoading) {
		return (
			<div className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
				<div className="max-w-3xl w-full bg-white rounded-lg shadow p-6">
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
	const ProfileActionsCard = ({ onLogout }) => {
		const handleDelete = () => {
			const confirmDelete = window.confirm("Are you sure you want to delete your profile? This action is irreversible.");
			if (confirmDelete) {
				// TODO: Replace with delete profile API
				toast.error("Profile deletion is not implemented yet.");
			}
		};

		return (
			<div className="bg-white rounded-xl shadow-md p-4 text-gray-700 space-y-4">
				<p className="font-medium text-lg text-red-600">Account Settings</p>
				<p className="text-sm text-gray-600 leading-relaxed">
					Here you can manage your account actions like logging out or permanently deleting your profile.
				</p>
				<div className="space-y-3">
					<button
						onClick={onLogout}
						className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-sm transition"
					>
						Logout
					</button>
					<button
						onClick={handleDelete}
						className="w-full bg-gray-100 hover:bg-gray-200 text-red-600 font-medium py-2 px-4 rounded-full transition text-sm"
					>
						Delete Profile
					</button>
				</div>
			</div>
		);
	};

	// JSX Return
	return (
		<div className="bg-gray-100 py-8 px-4 md:px-6">
			<div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Left Column - Main Profile */}
				<div className="lg:col-span-3 space-y-6">
					<SectionWrapper>
						<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<LocationDomainSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<SocialLinksSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
					</SectionWrapper>

					<SectionWrapper>
						<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
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

					{/* Mobile: Profile Actions */}
					{isOwnProfile && (
						<div className="lg:hidden">
							<ProfileActionsCard onLogout={logout} />
						</div>
					)}
				</div>

				{/* Right Sidebar */}
				<div className="hidden lg:block col-span-1">
					<div className="sticky top-28 space-y-6">
						<div className="bg-white rounded-xl shadow-md p-4 text-gray-600 text-sm">
							<p className="font-semibold text-gray-800 mb-2">Want to improve your profile?</p>
							<ul className="list-disc list-inside text-gray-600 text-sm">
								<li>Fill in your experiences</li>
								<li>List your skills</li>
								<li>Add a professional profile picture</li>
							</ul>
						</div>

						{/* Desktop: Profile Actions */}
						{isOwnProfile && <ProfileActionsCard onLogout={logout} />}
					</div>
				</div>
			</div>
		</div>
	);
};

// Helper Section Wrapper
const SectionWrapper = ({ children }) => (
	<div className="bg-white rounded-2xl shadow-md p-6">{children}</div>
);

// Loader while fetching data
const SkeletonLoader = () => (
	<div className="space-y-4 animate-pulse">
		<div className="bg-gray-300 h-6 w-2/3 rounded" />
		<div className="bg-gray-300 h-40 rounded" />
		<div className="bg-gray-300 h-6 w-1/2 rounded" />
		<div className="bg-gray-300 h-6 w-full rounded" />
		<div className="bg-gray-300 h-40 rounded" />
		<div className="bg-gray-300 h-6 w-3/4 rounded" />
	</div>
);

export default ProfilePage;
