import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const FriendRequest = ({ request }) => {
	const queryClient = useQueryClient();

	const { mutate: acceptConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request accepted");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Something went wrong");
		},
	});

	const { mutate: rejectConnectionRequest } = useMutation({
		mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
		onSuccess: () => {
			toast.success("Connection request rejected");
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
		onError: (error) => {
			toast.error(error.response?.data?.message || "Something went wrong");
		},
	});

	// Defensive check if sender exists
	if (!request.sender) {
		return (
			<div className="p-4 bg-yellow-100 rounded-md text-yellow-800">
				Request information is incomplete.
			</div>
		);
	}

	return (
		<div className="bg-base-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:shadow-md border border-base-300">
			<div className="flex items-center gap-4 w-full md:w-auto">
				<Link to={`/profile/${request.sender?.username}`} className="shrink-0">
					<img
						src={request.sender?.profilePicture || "/avatar.png"}
						alt={request.sender?.name || "User"}
						className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
					/>
				</Link>

				<div className="min-w-0">
					<Link to={`/profile/${request.sender?.username}`} className="font-bold text-lg text-base-content hover:text-blue-600 transition-colors line-clamp-1">
						{request.sender?.name}
					</Link>
					<p className="text-base-content/70 text-sm line-clamp-1">{request.sender?.headline}</p>
				</div>
			</div>

			<div className="flex gap-2 w-full md:w-auto shrink-0">
				<button
					className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow active:scale-95"
					onClick={() => acceptConnectionRequest(request._id)}
				>
					Accept
				</button>
				<button
					className="flex-1 md:flex-none bg-base-200 text-base-content/80 border border-base-300 px-6 py-2 rounded-full font-medium hover:bg-base-300 transition-all hover:border-base-300 active:scale-95"
					onClick={() => rejectConnectionRequest(request._id)}
				>
					Reject
				</button>
			</div>
		</div>
	);
};

export default FriendRequest;
