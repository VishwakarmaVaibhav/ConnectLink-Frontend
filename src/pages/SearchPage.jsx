import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { Search } from "lucide-react";
import TrendingNews from "../components/TrendingNews";
import RecommendedUser from "../components/RecommendedUser";

const SearchPage = () => {
	const [query, setQuery] = useState("");
	const [activeFilter, setActiveFilter] = useState("all"); // all, people, posts

	// Fetch recommended users
	const { data: recommendedUsers } = useQuery({
		queryKey: ["recommendedUsers"],
		queryFn: async () => {
			const res = await axiosInstance.get("/users/suggestions");
			return res.data;
		},
	});

	// Fetch search results
	const { data: searchResults, isLoading: isSearchLoading } = useQuery({
		queryKey: ["searchResults", query, activeFilter],
		queryFn: async () => {
			if (!query.trim()) return [];
			const res = await axiosInstance.get(`/search?query=${query}&type=${activeFilter}`);
			return res.data;
		},
		enabled: !!query.trim(),
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 p-5 gap-6 bg-base-200 min-h-screen">
			{/* Sidebar */}
			<div className="hidden lg:block lg:col-span-1">
				<Sidebar />
			</div>

			{/* Main Feed */}
			<div className="col-span-1 lg:col-span-2 order-first lg:order-none space-y-6">
				{/* Search Bar */}
				<div className="relative">
					<input
						type="text"
						className="w-full p-3 pl-12 rounded-xl bg-base-100 shadow-md focus:outline-none"
						placeholder="Search for users or posts..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<Search className="absolute left-3 top-3 text-base-content/60" />
				</div>

				{/* Filter Pills */}
				<div className="flex gap-2">
					{["all", "people", "posts"].map((filter) => (
						<button
							key={filter}
							onClick={() => setActiveFilter(filter)}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize
                                ${activeFilter === filter
									? "bg-blue-600 text-white"
									: "bg-base-100 text-base-content/70 hover:bg-base-200"}`}
						>
							{filter}
						</button>
					))}
				</div>

				{/* Search Results */}
				{isSearchLoading ? (
					<div className="animate-pulse space-y-4 bg-base-100 p-4 rounded-xl shadow">
						<div className="h-32 bg-base-300 rounded-lg"></div>
						<div className="h-4 w-1/3 bg-base-300 rounded"></div>
						<div className="h-4 w-full bg-base-300 rounded"></div>
					</div>
				) : (
					<>
						{/* Display search results if any */}
						{searchResults?.length ? (
							searchResults.map((result) => (
								<div key={result._id}>
									{/* Handle mixed User/Post objects. The controller returns 'type' or we infer logic */}
									{result.type === "user" || result.username ? (
										<div className="bg-base-100 p-4 rounded-xl shadow mb-4">
											<RecommendedUser user={result} />
										</div>
									) : (
										<Post post={result} />
									)}
								</div>
							))
						) : (
							<div className="bg-base-100 rounded-xl shadow p-8 text-center">
								<h2 className="text-2xl font-bold mb-4 text-base-content">
									No Results Found
								</h2>
								<p className="text-base-content/70">
									Try searching for users, posts, or topics.
								</p>
							</div>
						)}
					</>
				)}
			</div>

			{/* Right Sidebar */}
			<div className="col-span-1 lg:col-span-1 hidden lg:flex flex-col gap-6">
				{/* Recommended Users */}
				{recommendedUsers?.length > 0 && (
					<div className="bg-base-100 rounded-xl shadow p-4">
						<h2 className="text-lg font-semibold mb-4 text-base-content">People you may know</h2>
						{recommendedUsers.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				)}

				{/* Trending News */}
				<div className="bg-base-100 rounded-xl shadow p-4">
					<h2 className="text-lg font-light mb-4 text-base-content">Trending News</h2>
					<TrendingNews />
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
