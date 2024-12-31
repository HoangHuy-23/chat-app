import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Bell, UserPlus, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useGroupStore } from "../store/useGroupStore";

const ChatContainer = () => {
  const {
    selectedUser,
    isUserLoading,
    isMessageLoading,
    users,
    messages,
    getUsers,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  //group data
  const {
    selectedGroup,
    isGroupLoading,
    groupMessages,
    getGroupMessages,
    createGroup,
    addMember,
  } = useGroupStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedGroup) {
      getGroupMessages(selectedGroup._id).then((messages) =>
        console.log("Group messages:", messages)
      );
    }
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();

    console.log("selectedUser", selectedUser);
    console.log("selectedGroup", selectedGroup);

    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    selectedGroup,
    getGroupMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && (messages || groupMessages))
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, groupMessages]);

  if (isMessageLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  const [isSideOpen, setIsSideOpen] = React.useState(false);

  const toggleSide = () => setIsSideOpen((prev) => !prev);

  const handleCreateGroup = async () => {
    try {
      await createGroup({
        name: selectedUser.fullName + " - " + authUser.fullName + " Group",
        member: [selectedUser._id],
      });
      toast.success("Group created successfully");
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error creating group");
    }
  };

  const handleAddMember = async () => {
    try {
      await addMember(selectedGroup._id, "6773d53c9c1e6ad6e867df9a");
      toast.success("Member added successfully");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Error adding member");
    }
  };

  return (
    <div
      className={`grid grid-cols-1 w-full h-full ${
        isSideOpen ? "md:grid-cols-3" : ""
      }`}
    >
      <div className="col-span-2 flex flex-1 flex-col overflow-auto">
        <ChatHeader toggleSide={toggleSide} />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedUser &&
            messages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-md sm:max-w-[200px] mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
          {selectedGroup &&
            groupMessages.map((message) => (
              <div
                key={message._id}
                className={`chat ${
                  message.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={
                        message.senderId === authUser._id
                          ? authUser?.profilePic || "/avatar.png"
                          : selectedUser?.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                    />
                  </div>
                </div>
                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.createdAt)} - {message.senderId}
                  </time>
                </div>
                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-md sm:max-w-[200px] mb-2"
                    />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
        </div>
        <MessageInput />
      </div>
      {/* side */}
      <div
        className={`flex flex-1 flex-col overflow-auto border-l transform transition-transform duration-700 translate-x-0 ${
          !isSideOpen ? "hidden" : ""
        }`}
      >
        {/* title header */}
        <div className="flex items-center justify-center  h-[70px] border-b">
          <h2 className="text-lg font-semibold">Information</h2>
        </div>
        {/* user info */}
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <div className="avatar">
            <div className="size-20 rounded-full border">
              {selectedUser ? (
                <img
                  src={selectedUser?.profilePic || "/avatar.png"}
                  alt="profile pic"
                />
              ) : (
                <img
                  src={selectedGroup?.avatar || "/group.png"}
                  alt="group pic"
                />
              )}
            </div>
          </div>
          <h3 className="font-medium">
            {selectedUser ? selectedUser?.fullName : selectedGroup?.name}
          </h3>
          {/* action */}
          <div className="flex w-full justify-around items-start">
            {/* mute */}
            <div className="flex flex-col items-center">
              <button className="rounded-full p-2 bg-primary/30 text-primary-content">
                <Bell size={18} />
              </button>
              <span className="text-sm text-base-content">Mute</span>
            </div>
            <>
              {selectedGroup ? (
                // add member
                <div className="flex flex-col items-center">
                  <button
                    className="rounded-full p-2 bg-primary/30 text-primary-content"
                    onClick={handleAddMember}
                  >
                    <UserPlus size={18} />
                  </button>
                  <span className="text-sm text-base-content">Add</span>
                  <span className="text-sm text-base-content">member</span>
                </div>
              ) : (
                // create group
                <div className="flex flex-col items-center">
                  <button
                    className="rounded-full p-2 bg-primary/30 text-primary-content"
                    onClick={handleCreateGroup}
                  >
                    <Users size={18} />
                  </button>
                  <span className="text-sm text-base-content">Create</span>
                  <span className="text-sm text-base-content">group</span>
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
