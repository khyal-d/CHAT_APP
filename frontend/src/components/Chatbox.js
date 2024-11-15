import React from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import "./Chatbox.css"; // Import your custom CSS file

function Chatbox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = ChatState();

  return (
    <div className={`chatbox-container`}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}

export default Chatbox;
