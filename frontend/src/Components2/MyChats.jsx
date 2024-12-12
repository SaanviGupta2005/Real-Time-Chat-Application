import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import { toaster } from "../components/ui/toaster";
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(null);
  const { user, selectedChat, setSelectedChat, chats, setChats,theme } = ChatState();

  const fetchChats = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });
      setChats(data);
    } catch (error) {
      toaster.create({
        title: "Error Occurred",
        description: "Failed to load chats",
        type: "error",
        duration: 3000,
      });
    }
  }, [user.token, setChats]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setLoggedUser(userInfo);
    }
    fetchChats();
  }, [fetchAgain, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      bg={theme === "dark" ? "gray.700" : "gray.50"}
      color={theme === "dark" ? "white" : "black"}
      borderColor={theme === "dark" ? "gray.600" : "gray.200"}
      flexDirection="column"
      alignItems="center"
      padding={4}
      width={{ base: "100%", md: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
      boxShadow="md"
    >
      <Box
        paddingBottom={4}
        paddingX={4}
        width="100%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontFamily="Work sans"
      >
        <Text fontSize={{ base: "24px", md: "28px" }}>My Chats</Text>

        <GroupChatModal>
          <Button
            size={{ base: "sm", md: "sm" }}
            bg="whitesmoke"
            color="black"
            marginRight="-4"
          >
            New Group Chat ➕
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        padding="3"
        bg={theme === "dark" ? "gray.800" : "#F8F8F8"}
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="auto">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                paddingX="3"
                paddingY="2"
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
