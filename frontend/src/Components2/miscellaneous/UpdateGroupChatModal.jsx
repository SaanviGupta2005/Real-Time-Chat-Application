import React, { useState } from 'react'
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
import { Box, Flex, Input, Spinner, useDisclosure } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { toaster } from '../../components/ui/toaster';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchMessages, fetchAgain, setFetchAgain }) => {
    
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    
    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
    };
    
    const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
    };
    
    const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toaster.create({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toaster.create({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
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
    setGroupChatName("");
  };


    const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toaster.create({
        title: "Only admins can remove someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
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
    setGroupChatName("");
  };

  return (
    <>
      <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" backgroundColor='whitesmoke'>
          👁️
        </Button>
      </DialogTrigger>
      <DialogContent>
                  <DialogHeader
                      fontSize={'35px'}
                      fontFamily={'Work sans'}
                      display={'flex'}
                      justifyContent={'center'}
                      backgroundColor={'whiteAlpha.800'}
                      color={'black'}
                  >
          <DialogTitle>{selectedChat.chatName}</DialogTitle>
        </DialogHeader>
                  <DialogBody
                      fontSize={'35px'}
                      fontFamily={'Work sans'}
                      display={'flex'}
                      flexDir={'column'}
                      marginBottom={'0'}
                      paddingBottom={'0'}
                      backgroundColor={'whiteAlpha.800'}
                      color={'black'}
                  >
                      <Box width={'100%'} display={'flex'} flexWrap={'wrap'} paddingBottom={'3'} >
                          {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
                      </Box>
                    <Flex alignItems="center" gap={2} mb={3}>
  <Input
    placeholder="Chat Name"
    value={groupChatName}
    onChange={(e) => setGroupChatName(e.target.value)}
  />
  <Button
    variant="solid"
    backgroundColor="teal"
    color='white'
    borderRadius='lg'
    isLoading={renameloading}
    onClick={handleRename}
  >
    Update
  </Button>
                      </Flex>  
    <Box alignItems={'center'} width={'80%'}
                          justifyContent={'center'}
                          marginBottom={1} marginLeft={'0'} display={'flex'}>
  <Input display={'flex'} justifyContent={'left'}
    placeholder="Add User to group"
    onChange={(e) => handleSearch(e.target.value)}
  />
</Box>

{loading ? (
  <Spinner size="lg" />
) : (
  searchResult?.map((user) => (
    <UserListItem
      key={user._id}
      user={user}
      handleFunction={() => handleAddUser(user)}
    />
  ))
)}
        </DialogBody>
        <DialogFooter variant="solid"
    backgroundColor="whiteAlpha.800"
    color='white' marginTop={'0'}>
          <DialogActionTrigger asChild>
            <Button onClick={() => handleRemove(user)} width='25%' variant="solid" backgroundColor='red' borderRadius='lg' marginTop='0' color='white'>Leave Group</Button>
          </DialogActionTrigger>
        </DialogFooter >
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
    </>
  )
}

export default UpdateGroupChatModal
