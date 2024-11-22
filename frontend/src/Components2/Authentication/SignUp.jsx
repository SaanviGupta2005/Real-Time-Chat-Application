import { Input, VStack, Box, Text, Button } from '@chakra-ui/react'
import { toaster } from "../../components/ui/toaster"; 
import axios from "axios";
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const history = useHistory();

    const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toaster.create({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png"|| pics.type === "image/jpg") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dyq5s8efb");
      fetch("https://api.cloudinary.com/v1_1/dyq5s8efb/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toaster.create({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

   const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toaster.create({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toaster.create({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toaster.create({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
      <VStack color={"black"} spaceY={'2'}>
        <Box width={"100%"} isRequired>
            <Text id="name">Name</Text>
            <Input placeholder='Enter your Name: ' onChange={(e) => setName(e.target.value)} />
        </Box>
        <Box width={"100%"} isRequired>
            <Text id="email">Email</Text>
            <Input placeholder='Enter your Email: ' onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box width={"100%"} isRequired>
            <Text id="password">Password</Text>
            <Input type='password' placeholder='Enter your Password: ' onChange={(e) => setPassword(e.target.value)} />
        </Box>
        <Box  width={"100%"} isRequired>
            <Text id="confirmpassword">Confirm Password</Text>
            <Input type='password' placeholder='Enter your Password: ' onChange={(e) => setConfirmpassword(e.target.value)} />
        </Box>
        <Box width={"100%"} isRequired>
            <Text id="pic">Upload your picture</Text>
            <Input type='file' p={1.5} accept='image/*' placeholder='Enter your Password: ' onChange={(e) => postDetails(e.target.files[0])} />
        </Box>
        <Button colorPalette={"blue"} width={"100%"} style={{marginTop: 15}} onClick={submitHandler} isLoading = {picLoading}>
            Sign Up
        </Button>
    </VStack >
  )
}

export default SignUp
