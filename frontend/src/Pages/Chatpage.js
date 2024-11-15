import React, { useState } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import "../styles/ChatPage.css"; // Import your custom CSS file

function Chatpage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 440);
  const { user, selectedChat } = ChatState();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 440);
    };
    window.addEventListener("resize", handleResize, false);
    return () => {
      window.removeEventListener("resize", handleResize, false);
    };
  }, [isMobile]);

  return (
    <div className="chatpage-container">
      {user && <SideDrawer />}
      <div className="chatpage-content">
        {user && isMobile && !selectedChat && <MyChats fetchAgain={fetchAgain} />}
        {user && isMobile && selectedChat && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
        {user && !isMobile && <MyChats fetchAgain={fetchAgain} />}
        {user && !isMobile && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  );
}

export default Chatpage;
