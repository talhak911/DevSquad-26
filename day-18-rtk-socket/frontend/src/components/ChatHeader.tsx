import React from "react";
import "./ChatHeader.css";
import { useAppSelector } from "../hooks";
import { useGetRoomsQuery } from "../store/chatApi";

const ChatHeader: React.FC = () => {
  const { currentRoomId } = useAppSelector((s) => s.chat);
  const { data: rooms } = useGetRoomsQuery();

  const currentRoom = rooms?.find((r) => r.id === currentRoomId);

  if (!currentRoomId || !currentRoom) {
    return (
      <div className="chat-header">
        <span className="header-logo">💬</span>
        <div>
          <h2 className="header-title">DevChat</h2>
          <p className="header-sub">Select a channel to start</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-header">
      <span className="header-icon">{currentRoom.icon}</span>
      <div>
        <h2 className="header-title"># {currentRoom.name}</h2>
        <p className="header-sub">{currentRoom.description}</p>
      </div>
      <div className="header-badge">
        <span className="header-badge-dot" />
        Live
      </div>
    </div>
  );
};

export default ChatHeader;
