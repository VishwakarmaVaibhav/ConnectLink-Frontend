import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className='bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md p-5 flex flex-col items-center transition-all'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-3 border-2 border-gray-100'
				/>
				<h3 className='font-semibold text-xl text-center text-gray-800'>{user.name}</h3>
			</Link>
			<p className='text-sm text-gray-600 text-center mt-1'>{user.headline}</p>
			<p className='text-xs text-gray-500 mt-2'>{user.connections?.length} connections</p>

			<button
				className={`mt-4 w-full px-4 py-2 rounded-md font-medium transition-colors ${
					isConnection
						? "bg-gray-200 text-gray-700 cursor-default"
						: "bg-blue-600 text-white hover:bg-blue-700"
				}`}
				disabled={isConnection}
			>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;
