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
		return <div className="text-center text-gray-500 py-8 italic">No posts available</div>;
	}

	return (
		<div className="rounded-xl p-4 md:p-6 bg-white">
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-semibold text-gray-800">Recent Posts</h2>
				{isOwnProfile && (
					<button
					onClick={() => {
						navigate("/");
						setTimeout(() => {
							window.scrollTo({ top: 0, behavior: "smooth" });
						}, 100); // Slight delay to wait for page render
					}}
					
						className="bg-green-600 hover:bg-green-700 text-white py-1.5 px-4 rounded-full text-sm shadow-sm"
					>
						➕ Add Post
					</button>
				)}
			</div>

			{/* Desktop Swiper */}
			<div className="hidden md:block">
				<Swiper
					spaceBetween={20}
					slidesPerView={2}
					navigation
					modules={[Navigation]}
				>
					{visiblePosts.map((post) => (
						<SwiperSlide key={post._id}>
							<div
								onClick={() => navigate(`/post/${post._id}`)}
								className="cursor-pointer group bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm transition duration-200 h-full"
							>
								{post.image?.length > 0 && (
									<img
										src={post.image[0]}
										alt="Post"
										className="w-full h-56 object-cover rounded-t-xl"
										loading="lazy"
									/>
								)}

								<div className="p-4 h-[220px] flex flex-col justify-between">
									<div>
										

										{post.content && (
											<p className="text-sm text-gray-700 mt-2 line-clamp-3">
												{post.content}
											</p>
										)}

										{post.projectLink && (
											<a
												href={post.projectLink}
												target="_blank"
												rel="noopener noreferrer"
												onClick={(e) => e.stopPropagation()}
												className="text-blue-500 mt-3 inline-block text-sm hover:underline"
											>
												View Project
											</a>
										)}
									</div>

									<div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
										<span>👍 {post.likes?.length || 0}</span>
										<span>💬 {post.comments?.length || 0}</span>
										{isOwnProfile && (
											<button
												onClick={(e) => {
													e.stopPropagation();
													handleDelete(post._id);
												}}
												className="text-red-500 hover:text-red-600 transition"
											>
												<Trash2 size={18} />
											</button>
										)}
									</div>
								</div>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>

			{/* Mobile Layout */}
			<div className="block md:hidden space-y-5">
				{visiblePosts.map((post) => (
					<div
						key={post._id}
						onClick={() => navigate(`/post/${post._id}`)}
						className="cursor-pointer group bg-gray-50 hover:bg-gray-100 rounded-xl shadow-sm transition"
					>
						{post.image?.length > 0 && (
							<img
								src={post.image[0]}
								alt="Post"
								className="w-full h-52 object-cover rounded-t-xl"
								loading="lazy"
							/>
						)}

						<div className="p-4">
							

							{post.content && (
								<p className="text-sm text-gray-700 mt-2 line-clamp-3">{post.content}</p>
							)}

							{post.projectLink && (
								<a
									href={post.projectLink}
									target="_blank"
									rel="noopener noreferrer"
									onClick={(e) => e.stopPropagation()}
									className="text-blue-500 mt-3 inline-block text-sm hover:underline"
								>
									View Project
								</a>
							)}

							<div className="flex items-center justify-between mt-4 text-gray-500 text-sm">
								<span>👍 {post.likes?.length || 0}</span>
								<span>💬 {post.comments?.length || 0}</span>
								{isOwnProfile && (
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleDelete(post._id);
										}}
										className="text-red-500 hover:text-red-600 transition"
									>
										<Trash2 size={18} />
									</button>
								)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Show More / Less Button */}
			{posts.length > 4 && (
				<div className="flex justify-center mt-8">
					<button
						className="text-blue-600 hover:text-blue-800 font-medium text-sm"
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
