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
		queryKey: ["searchResults", query],
		queryFn: async () => {
			if (!query.trim()) return [];  // Skip API call if query is empty
			const res = await axiosInstance.get(`/search?query=${query}`);
			return res.data;
		},
		enabled: !!query.trim(),  // Only make the request if query is not empty
	});

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 p-5 gap-6 bg-gray-100 min-h-screen">
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
						className="w-full p-3 pl-12 rounded-xl bg-white shadow-md focus:outline-none"
						placeholder="Search for users or posts..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<Search className="absolute left-3 top-3 text-gray-500" />
				</div>

				{/* Search Results */}
				{isSearchLoading ? (
					<div className="animate-pulse space-y-4 bg-white p-4 rounded-xl shadow">
						<div className="h-32 bg-gray-300 rounded-lg"></div>
						<div className="h-4 w-1/3 bg-gray-300 rounded"></div>
						<div className="h-4 w-full bg-gray-300 rounded"></div>
					</div>
				) : (
					<>
						{/* Display search results if any */}
						{searchResults?.length ? (
							searchResults.map((result) => (
								<div key={result._id}>
									<Post post={result} />
								</div>
							))
						) : (
							<div className="bg-white rounded-xl shadow p-8 text-center">
								<h2 className="text-2xl font-bold mb-4 text-gray-800">
									No Results Found
								</h2>
								<p className="text-gray-600">
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
					<div className="bg-white rounded-xl shadow p-4">
						<h2 className="text-lg font-semibold mb-4 text-gray-800">People you may know</h2>
						{recommendedUsers.map((user) => (
							<RecommendedUser key={user._id} user={user} />
						))}
					</div>
				)}

				{/* Trending News */}
				<div className="bg-white rounded-xl shadow p-4">
					<h2 className="text-lg font-light mb-4 text-gray-800">Trending News</h2>
					<TrendingNews />
				</div>
			</div>
		</div>
	);
};

export default SearchPage;
