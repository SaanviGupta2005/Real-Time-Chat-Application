// import axios from 'axios';
import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box, Button } from '@chakra-ui/react';
import SideDrawer from '../Components2/miscellaneous/SideDrawer';
import MyChats from '../Components2/MyChats';
import ChatBox from '../Components2/ChatBox';
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";

const ChatPage = () => {
  const { user,toggleTheme, theme } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ color: theme === "dark" ? "white" : "black", width: "100%" }}>
      {user &&
        (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="5px"
        >
          <SideDrawer />
          <Button
            onClick={toggleTheme}
            bg={theme === "dark" ? "gray.700" : "gray.200"} // Dark gray for dark theme, light gray for light theme
            color={theme === "dark" ? "gray.200" : "gray.800"} 
            width="16"
            height="16"
            marginLeft="2"
            borderRadius="full"
            _hover={{
              bg: theme === "dark" ? "gray.700" : "gray.200", 
            }}
          >
            {theme === "dark" ? <MdSunny /> : <FaMoon />}
          </Button>

        </Box>
      )
      }
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h='91.5vh'
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  );
};

export default ChatPage;
