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
  const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");


    const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
        toaster.create({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setLoading(false);
        return;
    }

    if (!otpSent) {
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

            // Save user details temporarily for OTP verification
            localStorage.setItem("tempUser", JSON.stringify(data));
            await axios.post("/api/user/send-otp", { email }, config);

            toaster.create({
                title: "OTP Sent Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            setOtpSent(true);
            setLoading(false);
        } catch (error) {
            toaster.create({
                title: "Error Occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    } else {
        // Verify OTP
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/verify-otp",
                { email, otp },
                config
            );

            toaster.create({
                title: "Login Successful",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });

            // Store the verified user info
            const userData = JSON.parse(localStorage.getItem("tempUser"));
            localStorage.setItem("userInfo", JSON.stringify(userData));
            localStorage.removeItem("tempUser");

            setLoading(false);
            history.push("/chats");
        } catch (error) {
            toaster.create({
                title: "Error Occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
        }
    }
};



  return (
      <VStack color={"black"} spaceY={'2'}>
        {!otpSent ? (
    <>
        <Box width={"100%"} isRequired>
            <Text id="email">Email</Text>
            <Input placeholder="Enter your Email: " onChange={(e) => setEmail(e.target.value)} />
        </Box>
        <Box width={"100%"} isRequired>
            <Text id="password">Password</Text>
            <Input type="password" placeholder="Enter your Password: " onChange={(e) => setPassword(e.target.value)} />
        </Box>
    </>
) : (
    <Box width={"100%"} isRequired>
        <Text id="otp">OTP</Text>
        <Input placeholder="Enter OTP sent to your email" onChange={(e) => setOtp(e.target.value)} />
    </Box>
)}
<Button colorPalette={"blue"} width={"100%"} style={{ marginTop: 15 }} onClick={submitHandler}>
    {!otpSent ? "Log In" : "Verify OTP"}
</Button>

    </VStack >
  )
}

export default Login;
