import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Users } from "lucide-react";

const SignUpPage = () => {
	const { data: randomPosts } = useQuery({
		queryKey: ["randomPosts"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/posts/random");
				return res.data;
			} catch (error) {
				return [];
			}
		},
	});

	return (
		<div className="min-h-screen flex flex-col items-center bg-base-200">
			{/* Split Screen Hero & Signup */}
			<div className="w-full bg-gradient-to-tr from-blue-100 to-purple-100 pb-20 pt-10 px-4">
				<div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
					<div className="hidden md:block space-y-6">
						<img src="./small-logo.png" alt="ConnectLink" className="h-16 w-auto" />
						<h1 className="text-4xl font-extrabold text-base-content leading-tight">
							Your Professional Journey Starts Here
						</h1>
						<p className="text-lg text-base-content/80">
							Join thousands of students and alumni sharing knowledge, opportunities, and success stories.
						</p>
					</div>

					<div className="bg-base-100 rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md mx-auto md:mx-0 animate-fade-in-up">
						<div className="text-center mb-6">
							<h2 className="text-2xl sm:text-3xl font-bold text-base-content">
								Join ConnectLink
							</h2>
							<p className="text-sm text-base-content/60 mt-1">Totally free, forever.</p>
						</div>

						{/* Sign Up Form Component */}
						<SignUpForm />

						<div className="mt-8">
							<div className="relative mb-6">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-base-300" />
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="bg-base-100 px-2 text-base-content/60">Already on ConnectLink?</span>
								</div>
							</div>
							<Link
								to="/login"
								className="w-full inline-flex justify-center items-center py-2 px-4 border border-blue-500 text-blue-600 rounded-lg shadow-sm text-sm font-medium hover:bg-blue-50 transition-colors"
							>
								Sign in
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* About Section - "Why ConnectLink" */}
			<div className="w-full bg-base-100 border-b border-base-300 py-16">
				<div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<h2 className="text-3xl md:text-4xl font-bold text-base-content">
							More than just a profile. <br /><span className="text-blue-600">A Community.</span>
						</h2>
						<ul className="space-y-4 text-base-content/70 text-lg">
							<li className="flex items-start gap-3">
								<span className="bg-blue-100 text-blue-600 p-1 rounded-full mt-1">✓</span>
								Connect with alumni and industry mentors.
							</li>
							<li className="flex items-start gap-3">
								<span className="bg-blue-100 text-blue-600 p-1 rounded-full mt-1">✓</span>
								Showcase your projects and portfolio.
							</li>
							<li className="flex items-start gap-3">
								<span className="bg-blue-100 text-blue-600 p-1 rounded-full mt-1">✓</span>
								Find internships and job opportunities.
							</li>
						</ul>
					</div>
					<div className="hidden md:block relative">
						<div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full blur-3xl opacity-50"></div>
						<img src="/hero.png" alt="Community" className="relative rounded-2xl shadow-xl border-4 border-white" onError={(e) => e.target.style.display = 'none'} />
						<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 p-4 rounded-full shadow-lg" style={{ display: 'none' }}>
							<Users size={60} className="text-blue-500" />
						</div>
					</div>
				</div>
			</div>

			{/* Trending Posts Preview */}
			<div className="max-w-7xl mx-auto px-4 py-16 w-full">
				<div className="text-center mb-10">
					<h2 className="text-3xl font-bold text-base-content">See what's happening</h2>
					<p className="text-base-content/60 mt-2">Trending discussions from the community</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{(randomPosts || []).slice(0, 3).map((post) => (
						<div key={post._id} className="bg-base-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-base-300">
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
								<p className="text-base-content/80 text-sm line-clamp-3 post-preview">{post.content}</p>
							</div>
						</div>
					))}
				</div>
			</div>

		</div>
	);
};

export default SignUpPage;
