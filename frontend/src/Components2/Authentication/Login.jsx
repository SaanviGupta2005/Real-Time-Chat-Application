import { Input, VStack, Box, Text, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useHistory } from "react-router-dom";
import { toaster } from "../../components/ui/toaster"; 

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toaster.create({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toaster.create({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    //   setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
      console.log(JSON.stringify(data));
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };


  return (
      <VStack color={"black"} spaceY={'2'}>
        <Box width={"100%"} isRequired>
            <Text id="email">Email</Text>
            <Input placeholder='Enter your Email: ' onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box width={"100%"} isRequired>
            <Text id="password">Password</Text>
            <Input type='password' placeholder='Enter your Password: ' onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Button colorPalette={"blue"} width={"100%"} style={{marginTop: 15}} onClick={submitHandler}>
            Log In
        </Button>
          <Button colorPalette={"red"} width={"100%"} style={{ marginTop: 5 }} isLoading={loading} onClick={() => {
              setEmail("guest@example.com");
            setPassword("123456");
        } }>
            Get Guest User Credentials
        </Button>
    </VStack >
  )
}

export default Login;
