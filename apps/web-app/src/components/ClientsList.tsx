import { useSocket } from "../context/SocketContext";

const ClientsList = () => {
    // TODO: Remove hard coded profile icon
    const avatar = "https://api.dicebear.com/9.x/adventurer/svg?seed=Emery";
    const { users, username } = useSocket();

    return (
        <div className="space-y-2">
            {users.map((user, id) => (
                <li
                    key={id}
                    className={`flex justify-center items-center space-x-2 p-2 px-4 ${username !== null && user.username == username ? 'bg-blue-500' :'bg-white'} rounded-lg shadow-md hover:bg-gray-50 transition-all`}
                >
                    <img
                        src={avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                    />
                    <span className="text-base text-gray-800">
                        {user.username.split(" ")[0]}
                    </span>
                </li>
            ))}
        </div>
    );
};

export default ClientsList;
