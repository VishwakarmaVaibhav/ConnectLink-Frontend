import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import ErrorBoundary from "../components/ErrorBoundary";
import UserCard from "../components/UserCard";

const NetworkPage = () => {
	const { data: user } = useQuery({ queryKey: ["authUser"] });

	const { data: connectionRequests } = useQuery({
		queryKey: ["connectionRequests"],
		queryFn: () => axiosInstance.get("/connections/requests"),
	});

	const { data: suggestions } = useQuery({
		queryKey: ["networkSuggestions"],
		queryFn: () => axiosInstance.get("/users/suggestions").then(res => res.data),
	});

	const { data: connections } = useQuery({
		queryKey: ["connections"],
		queryFn: () => axiosInstance.get("/connections"),
	});

	return (
		<div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 px-4 py-6 bg-base-200 min-h-screen">
			{/* Sidebar */}
			<div className="col-span-1">
				<Sidebar user={user} />
			</div>

			{/* Main Content */}
			<div className="col-span-1 lg:col-span-3 space-y-8">
				{/* Page Title */}
				<div className="bg-base-100 rounded-2xl shadow-lg p-6">
					<h1 className="text-3xl font-bold text-base-content">My Network</h1>
					<p className="text-base-content/60 mt-1">Manage your connections and grow your network.</p>
				</div>

				{/* Connection Requests */}
				{connectionRequests?.data?.length > 0 ? (
					<div className="bg-base-100 rounded-2xl shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4 text-base-content">Connection Requests</h2>
						<div className="space-y-4">
							{connectionRequests.data.map((request) => (
								<ErrorBoundary key={request._id}>
									<FriendRequest request={request} />
								</ErrorBoundary>
							))}
						</div>
					</div>
				) : (
					<div className="bg-base-100 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center py-8">
						<UserPlus size={48} className="text-base-content/20 mb-4" />
						<h3 className="text-xl font-semibold text-base-content/80">No Pending Requests</h3>
						<p className="text-base-content/60 mt-2">
							Expand your network by connecting with people below!
						</p>
					</div>
				)}

				{/* People You May Know */}
				{suggestions?.length > 0 && (
					<div className="bg-base-100 rounded-2xl shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4 text-base-content">People You May Know</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{suggestions.map((user) => (
								<UserCard key={user._id} user={user} isConnection={false} />
							))}
						</div>
					</div>
				)}

				{/* Connections */}
				{connections?.data?.length > 0 && (
					<div className="bg-base-100 rounded-2xl shadow-lg p-6">
						<h2 className="text-xl font-semibold mb-4 text-base-content">My Connections</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{connections.data.map((connection) => (
								<UserCard key={connection._id} user={connection} isConnection={true} />
							))}
						</div>
					</div>
				)}

				{/* No Connections Yet */}
				{connections?.data?.length === 0 && (
					<div className="bg-base-100 rounded-2xl shadow-lg p-6 text-center text-base-content/60">
						<p className="text-lg mb-2">You haven't connected with anyone yet.</p>
						<p>Start by sending connection requests to people you may know.</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default NetworkPage;
