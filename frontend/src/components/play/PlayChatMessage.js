import React from "react";

function PlayChatMessage({ sender, message }) {
  return (
    <div className="pb-3">
      <p className="text-red-700 text-2xl">{sender}</p>
      <p className="text-black text-2xl">{message}</p>
    </div>
  );
}

export default PlayChatMessage;
