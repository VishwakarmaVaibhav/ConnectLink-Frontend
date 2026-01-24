import { Link } from "react-router-dom";

function UserCard({ user, isConnection }) {
	return (
		<div className='bg-base-100 border border-base-300 rounded-2xl shadow-sm hover:shadow-md p-5 flex flex-col items-center transition-all'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-24 h-24 rounded-full object-cover mb-3 border-2 border-base-300'
				/>
				<h3 className='font-semibold text-xl text-center text-base-content'>{user.name}</h3>
			</Link>
			<p className='text-sm text-base-content/70 text-center mt-1'>{user.headline}</p>
			<p className='text-xs text-base-content/60 mt-2'>{user.connections?.length} connections</p>

			<button
				className={`mt-4 w-full px-4 py-2 rounded-full font-medium transition-all duration-300 ${isConnection
						? "bg-base-200 text-base-content/60 cursor-default border border-base-300"
						: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow hover:-translate-y-0.5"
					}`}
				disabled={isConnection}
			>
				{isConnection ? "Connected" : "Connect"}
			</button>
		</div>
	);
}

export default UserCard;
