import { Columns2, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useEffect, useState } from "react";

const ChatHeader = ({ toggleSide }) => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { selectedGroup, setSelectedGroup } = useGroupStore();

  const [data, setData] = useState(null);

  useEffect(() => {
    if (selectedGroup) {
      setData(selectedGroup);
    } else {
      setData(selectedUser);
    }
  }, [selectedGroup, selectedUser]);

  const handleSetData = (data) => {
    if (selectedGroup) {
      setSelectedGroup(data);
    } else {
      setSelectedUser(data);
    }
  };
  return (
    <div className="p-2.5 border-b border-base-300 h-[70px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedGroup ? (
                <img src={data?.avatar || "/group.png"} alt={data?.name} />
              ) : (
                <img
                  src={data?.profilePic || "/avatar.png"}
                  alt={data?.fullName}
                />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">
              {selectedUser ? data?.fullName : data?.name}
            </h3>
            {selectedUser && (
              <p className="text-sm text-base-content/70">
                {onlineUsers.includes(data?._id) ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* detail chat */}
          <button onClick={() => toggleSide()}>
            <Columns2 />
          </button>
          {/* Close button */}
          <button onClick={() => handleSetData(null)}>
            <X />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
