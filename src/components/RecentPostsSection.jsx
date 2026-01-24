import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const RecentPostsSection = ({ posts = [], isOwnProfile = false, refetchPosts }) => {
	const [showAll, setShowAll] = useState(false);
	const visiblePosts = showAll ? posts : posts.slice(0, 4);
	const navigate = useNavigate();

	const handleDelete = async (id) => {
		try {
			await axiosInstance.delete(`/posts/${id}`);
			toast.success("Post deleted successfully");
			refetchPosts && refetchPosts();
		} catch (err) {
			console.error(err);
			toast.error("Failed to delete post");
		}
	};

	if (!posts.length) {
		return <div className="text-center text-base-content/60 py-8 italic">No posts available</div>;
	}

	return (

		<div className={` h-[450px] mb-6 ${isOwnProfile ? '' : 'mt-4'}`}>
			<div className="flex  items-center justify-between mb-4 px-1">
				<h2 className="text-xl md:text-2xl font-semibold text-base-content">Recent Posts</h2>
				{isOwnProfile && (
					<button
						onClick={() => {
							navigate("/");
							setTimeout(() => {
								window.scrollTo({ top: 0, behavior: "smooth" });
							}, 100);
						}}
						className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-full text-sm shadow-sm transition-transform active:scale-95 flex items-center gap-1"
					>
						<span>+</span> Post
					</button>
				)}
			</div>

			{/* Desktop Swiper - Hidden on mobile */}
			<div className="hidden md:block bg-base-100 md:h-[400px] rounded-xl p-4 shadow-sm">
				<Swiper
					spaceBetween={20}
					slidesPerView={2.2}
					navigation
					modules={[Navigation]}
					className="pb-4"
				>
					{visiblePosts.map((post) => (
						<SwiperSlide key={post._id} className="h-auto">
							<div
								onClick={() => navigate(`/post/${post._id}`)}
								className="cursor-pointer group bg-base-200 hover:bg-base-200 rounded-xl overflow-hidden border border-base-300 transition-all duration-300 hover:shadow-md h-auto flex flex-col"
							>
								{post.image?.length > 0 && (
									<div className="relative h-60 bg-gray-200 overflow-hidden shrink-0">
										<img
											src={post.image[0]}
											alt="Post"
											className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
									</div>
								)}

								<div className="p-3">
									<div>
										{post.content && (
											<p className="text-sm text-base-content/80 line-clamp-2 mb-2">
												{post.content}
											</p>
										)}
									</div>

									<div className="flex items-center justify-between pt-2 border-t border-base-300/50 text-base-content/60 text-xs">
										<div className="flex gap-3">
											<span>👍 {post.likes?.length || 0}</span>
											<span>💬 {post.comments?.length || 0}</span>
										</div>
										{isOwnProfile && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(post._id);
												}}
												className="text-base-content/40 hover:text-red-500 transition p-1"
											>
												<Trash2 size={16} />
											</button>
										)}
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Mobile Grid Layout - Instagram Style */}
			<div className="grid grid-cols-3 gap-1 md:hidden">
				{visiblePosts.map((post) => (
					<div
						key={post._id}
						onClick={() => navigate(`/post/${post._id}`)}
						className="relative aspect-square cursor-pointer group bg-base-200"
					>
						{post.image?.length > 0 ? (
							<img
								src={post.image[0]}
								alt="Post"
								className="w-full h-full object-cover"
								loading="lazy"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-gray-200">
								<span className="text-xs text-base-content/60 font-medium px-2 text-center line-clamp-2">
									{post.content || "Text Post"}
								</span>
							</div>
						)}

						{/* Overlay Icons (only visible if supported or needed, usually kept clean on mobile) */}
						<div className="absolute inset-0 bg-black/30 opacity-0 active:opacity-100 transition-opacity flex items-center justify-center text-white text-xs gap-2 font-bold pointer-events-none">
							<span>👍 {post.likes?.length || 0}</span>
						</div>
					</div>
				))}
			</div>

			{/* Show More / Less Button */}
			{posts.length > 4 && (
				<div className="flex justify-center mt-6">
					<button
						className="text-blue-600 hover:text-blue-800 font-medium text-sm px-4 py-2 bg-blue-50 rounded-full transition-colors"
						onClick={() => setShowAll((prev) => !prev)}
					>
						{showAll ? "Show Less" : "Show More"}
					</button>
				</div>
			)}
		</div>
	);

};

export default RecentPostsSection;
