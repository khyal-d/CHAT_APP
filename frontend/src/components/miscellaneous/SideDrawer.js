import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
// import {BasicMenu} from "../BasicMenu"

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [value, setValue] = useState();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  var socket;

  useEffect(() => {
    socket = io(ENDPOINT);
  });

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    socket.emit("logout");
    history.push("/");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#3e425784"
        css={{ backdropFilter: "blur(4px)" }}
        color="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="0px"
        position="relative" /* Add position relative */
        zIndex={1} /* Add z-index */
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button _hover={{ bg: "black" }} variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4} bg="#ffffff00">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text className="font" display="flex" fontSize="30px">
          <Text color="#00c23e">Chat</Text>
          <Text color="#1a85ff">Sync</Text>
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <BasicMenu></BasicMenu> */}
            <MenuList color="#ffffffa2" bg="#1E2027" pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              _hover={{ bg: "black" }}
              as={Button}
              bg="#1E2027"
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                color="black"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList style={{ backgroundColor: "black" }}>
              <ProfileModal user={user}>
                <MenuItem
                  style={{ backgroundColor: "black" }}
                  _hover={{ bg: "black" }}
                >
                  My Profile
                </MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem
                onClick={logoutHandler}
                style={{ backgroundColor: "black" }}
                _hover={({ bg: "black" }, { zIndex: "10" })}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((_user) => (
                <UserListItem
                  key={_user._id}
                  user={_user}
                  handleFunction={() => accessChat(_user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer> */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        {" "}
        {/* Added size "md" for better appearance */}
        <DrawerOverlay bg="rgba(0, 0, 0, 0.7)" /> {/* Dark overlay */}
        <DrawerContent bg="#2D3748" color="white">
          {" "}
          {/* Dark background and white text */}
          <DrawerHeader borderBottomWidth="1px" fontSize="20px">
            Search Users
          </DrawerHeader>{" "}
          {/* Adjusted font size */}
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="#4A5568" /* Darker input background color */
                color="white" /* White input text */
              />
              <Button onClick={handleSearch} type="submit" colorScheme="blue">
                Go
              </Button>{" "}
              {/* Blue button color */}
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((_user) => (
                <UserListItem
                  key={_user._id}
                  user={_user}
                  handleFunction={() => accessChat(_user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
