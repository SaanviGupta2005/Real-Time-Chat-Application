import React from 'react'
import { Container, Box, Text, Tabs } from "@chakra-ui/react"
import Login from "../Components2/Authentication/Login";
import SignUp from '../Components2/Authentication/SignUp';
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Homepage = () => {

  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW='xl' centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={3}
        bg={'white'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color={"black"} textAlign={"center"}>
          Talk-A-Tive
        </Text>
      </Box>
      <Box bg="white" w="100%" p={5} borderRadius="lg" borderWidth="1px" color={"black"}>
        <Tabs.Root variant="enclosed" maxW="md" fitted defaultValue={"tab-1"}>
          <Tabs.List mb={"1em"}>
            <Tabs.Trigger value="tab-1">
              Login
            </Tabs.Trigger>
            <Tabs.Trigger value="tab-2">
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value='tab-1' color={"black"}>
            <Login />
          </Tabs.Content>
          <Tabs.Content value='tab-2' color={"black"}>
            <SignUp />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  )
}

export default Homepage
