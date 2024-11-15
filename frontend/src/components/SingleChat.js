import React, { useCallback, useEffect, useState } from "react";
import {
  Fade,
  ScaleFade,
  Slide,
  SlideFade,
  Collapse,
  Avatar,
} from "@chakra-ui/react";
import axios from "axios";

import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import ProfileModal from "./miscellaneous/ProfileModal";
import { getSender, getSenderFull, getSenderpic } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import "./SingleChat.css"; // Import your custom CSS file
import { IconButton, Spacer, Spinner, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IoSend } from "react-icons/io5";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Chatty from "./Chatty";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import RoomPage from "./RoomPage";
import { FiVideo } from "react-icons/fi";
import { FiPhoneCall } from "react-icons/fi";
const ENDPOINT = "https://chatsync.onrender.com/";
var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      // Handle error
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        // Handle error
      }
    }
  };

  const history = useHistory();

  // const handleJoinRoom = useCallback(() => {
  //   const propstopass={
  //     chatId:selectedChat, userId:user, username:"its username"
  //   }
  //   history.push(`/room`, propstopass);
  // },[history,selectedChat]);

  const handleJoinRoomvideo = useCallback(() => {
    const propsToPass = {
      chat: selectedChat,
      chatId: selectedChat._id,
      userId: user._id,
      username: user.name,
      voice: false,
    };
    history.push({
      pathname: "/room",
      state: propsToPass,
    });
  }, [history, selectedChat, user]);

  const handleJoinRoomvoice = useCallback(() => {
    const propsToPass = {
      chat: selectedChat,
      chatId: selectedChat._id,
      userId: user._id,
      username: user.name,
      voice: true,
    };
    history.push({
      pathname: "/room",
      state: propsToPass,
    });
  }, [history, selectedChat, user]);

  const handleSendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        // Handle error
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  }, [notification, messages, setFetchAgain, fetchAgain]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <div className={`single-chat`}>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            justifyContent={"space-between"}
            bg="#08080abc"
            borderRadius="10px"
            fontFamily="Work sans"
            className="chat-header"
          >
            {/* <IconButton
              className="back-button"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            /> */}

            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  <div className="profilepicwithname">
                    <div className="back-button">
                      <button onClick={() => setSelectedChat("")}>
                        <MdOutlineArrowBackIosNew />
                      </button>
                    </div>
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                    <div className="sender-name">
                      {getSender(user, selectedChat.users)}
                    </div>
                  </div>
                  <div className="call-button-one">
                    <button onClick={handleJoinRoomvideo}>
                      <FiVideo />
                    </button>
                    <button onClick={handleJoinRoomvoice}>
                      <FiPhoneCall />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="groupiconwithname">
                    <div className="back-button">
                      <button onClick={() => setSelectedChat("")}>
                        <MdOutlineArrowBackIosNew />
                      </button>
                    </div>
                    <Avatar
                      mt="5px"
                      mr={1}
                      size="md"
                      cursor="pointer"
                      name={selectedChat.chatName}
                      src={""}
                    />
                    <div className="group-name">{selectedChat.chatName}</div>
                  </div>
                  <div className="call-button-group">
                    <button onClick={handleJoinRoomvideo}>
                      <FiVideo />
                    </button>
                    <button onClick={handleJoinRoomvoice}>
                      <FiPhoneCall />
                    </button>
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </div>
                </>
              ))}
          </Text>
          <div className="chatbox">
            {loading ? (
              <Spinner size="xl" className="spinner" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            {istyping ? (
              <div className="typing-indicator">
                <SlideFade in={istyping} transitionDuration="500ms">
                  <Lottie
                    options={defaultOptions}
                    style={{
                      marginBottom: "15px",
                      color: "blue",
                      marginLeft: "0",
                    }}
                  />
                </SlideFade>
              </div>
            ) : (
              <></>
            )}
            <div className="message-input-container">
              <div className="input-with-send-icon">
                <input
                  className="message-input"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  onKeyDown={sendMessage}
                />
                <div className="send-button">
                  <button onClick={handleSendMessage}>
                    <IoSend />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-chat">
          <div className="gify">
            <img
              src="https://media0.giphy.com/media/MfnJATkfrAIBG/giphy.gif"
              alt="GIF"
            />
          </div>
          <div className="empty-text">
            <h1>Click on a user to start chatting</h1>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleChat;
