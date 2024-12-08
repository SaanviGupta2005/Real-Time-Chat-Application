import React, { useEffect, useState } from 'react';
import { ChatState } from "../Context/ChatProvider";
import { Box, Text, Spinner, Input } from '@chakra-ui/react';
import { GoArrowLeft } from "react-icons/go";
import { Button } from '../components/ui/button';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import { toaster } from '../components/ui/toaster';
import { io } from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";

const ENDPOINT = "http://localhost:5000"; // Update this for deployment.
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification, theme } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occurred!",
        description: "Failed to load messages.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Real-time message handler
    socket.on("message received", (newMessageReceived) => {
  if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
    setNotification((prevNotifications) => {
      const chatNotification = prevNotifications.find(
        (notif) => notif.chat._id === newMessageReceived.chat._id
      );

      if (chatNotification) {
        // Increment count for existing chat notification
        return prevNotifications.map((notif) =>
          notif.chat._id === newMessageReceived.chat._id
            ? { ...notif, count: notif.count + 1 }
            : notif
        );
      } else {
        // Add new notification for a different chat
        return [...prevNotifications, { ...newMessageReceived, count: 1 }];
      }
    });

    setFetchAgain((prevFetchAgain) => !prevFetchAgain); // Trigger re-fetch if needed
  } else {
    setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
  }
});

    return () => {
      socket.off("message received");
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [notification, selectedChatCompare]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage("");
      } catch (error) {
        toaster.create({
          title: "Error Occurred!",
          description: "Failed to send the message.",
          type: "error",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            paddingBottom={3}
            paddingX={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Button
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            >
              <GoArrowLeft size={24} />
            </Button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            backgroundColor={theme === "dark" ? "#1A202C" : "#E8E8E8"} // Darker gray for dark theme, light gray for light theme
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >

            {loading ? (
              <Spinner size="xl" width={20} height={20} alignSelf="center" margin="auto" />
            ) : (
              <ScrollableChat messages={messages} theme={theme} />
            )}
            <Box mt={3}>
              {istyping && (
                <div>
                  <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} />
                </div>
              )}
              <Input
                variant="filled"
                placeholder="Enter a message..."
                backgroundColor={theme === "dark" ? "#2D3748" : "#E0E0E0"} // Dark gray for dark theme, light gray for light theme
                color={theme === "dark" ? "white" : "black"} // White text for dark theme, black text for light theme
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
              />

            </Box>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Text fontSize="3xl" fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
