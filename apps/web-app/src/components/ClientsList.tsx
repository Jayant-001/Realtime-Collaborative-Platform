import { useSocket } from "../context/SocketContext";

const ClientsList = () => {
    const avatar = "https://api.dicebear.com/9.x/adventurer/svg?seed=Emery";
    const { users } = useSocket();

    return (
        <div className="space-y-2">
            {users.map((user, id) => (
                <li
                    key={id}
                    className="flex justify-center items-center space-x-2 p-2 px-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-all"
                >
                    <img
                        src={avatar}
                        alt={user.username}
                        // width={8}
                        // height={8}
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
