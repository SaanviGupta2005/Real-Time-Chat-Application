import React from 'react'
import { Button } from "../../components/ui/button"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Image, Box, Text } from "@chakra-ui/react"

const ProfileModal = ({ user, children }) => {
  return (
    <>
      <DialogRoot>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Profile
          </Button>
        </DialogTrigger>
        <DialogContent bg="white" color="black">
          <DialogHeader 
            fontSize="40px" 
            fontFamily="Work sans" 
            display="flex" 
            justifyContent="center"
          >
            <DialogTitle>{user.name}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Image
                src={user.pic}
                boxSize="150px"
                borderRadius="full"
                objectFit="cover"
                alt={user.name}
              />
            </Box>
            <Text
              fontSize={{ base: "24px", md: "30px" }}
              fontFamily="Work sans"
              mt="8"
              textAlign="center"
            >
              Email: {user.email}
            </Text>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button colorPalette={'blue'}>Close</Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};

export default ProfileModal;
