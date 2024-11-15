import { AddIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender, getSenderpic } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Avatar, Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import "./MyChat.css";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  console.log(loggedUser);

  return (
    <div className="my-chats">
      <div className="chats-header">
        <span>My Chats</span>
        <GroupChatModal>
          <div className="add-button">+</div>
        </GroupChatModal>
      </div>
      <div className="chats-list">
        {chats ? (
          <div className="chats">
            {chats?.map((chat) => (
              <div
                key={chat._id}
                className={`chat-box ${
                  selectedChat === chat ? "selected" : ""
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="my-chat-bar">
                  <Avatar
                    mt="5px"
                    mr={1}
                    size="md"
                    cursor="pointer"
                    name={
                      chat.isGroupChat
                        ? chat.chatName
                        : getSender(loggedUser, chat.users)
                    }
                    src={
                      chat.isGroupChat
                        ? ""
                        : getSenderpic(loggedUser, chat.users)
                    }
                  />
                  <div className="my-chat-info">
                    <div className="chat-name">
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </div>
                    {chat.latestMessage && (
                      <div className="latest-message">
                        {chat.isGroupChat ? (
                          chat.latestMessage.sender?._id === loggedUser?._id ? (
                            <b>You:</b>
                          ) : (
                            <b>{chat.latestMessage.sender.name}:</b>
                          )
                        ) : null}{" "}
                        {chat.latestMessage.content.length > 30
                          ? chat.latestMessage.content.substring(0, 31) + "..."
                          : chat.latestMessage.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

          </div>

        ) : (
          <div className="chats">
            <ChatLoading />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChats;
