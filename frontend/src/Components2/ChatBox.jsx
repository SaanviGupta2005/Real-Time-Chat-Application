import React from 'react'
import { Box } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import "./styles.css";
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, theme } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDirection="column"
      padding={3}
      backgroundColor="white"
      bg={theme === "dark" ? "gray.700" : "white"}
      color={theme === "dark" ? "white" : "black"}
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={theme === "dark" ? "black" : "whitesmoke"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox
