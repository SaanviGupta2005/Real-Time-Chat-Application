// SideDrawer.js
import React, { useState } from 'react';
import { Box, Text, Input, useDisclosure } from '@chakra-ui/react';
import { Button } from "../../components/ui/button";
import { Tooltip } from "../../components/ui/tooltip";
import { Avatar } from "../../components/ui/avatar";
import { useHistory } from "react-router-dom";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../../components/ui/menu";
import { ChatState } from '../../Context/ChatProvider';
import { Spinner } from "@chakra-ui/react";
import ProfileModal from '../miscellaneous/ProfileModal';
import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerRoot,
} from "../../components/ui/drawer";
import { Toaster, toaster } from "../../components/ui/toaster";
import UserListItem from '../UserAvatar/UserListItem';
import ChatLoading from '../ChatLoading';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, selectedChat, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo"); 
    setSearchResult([]); 
    history.push("/"); 
    window.location.href = "/"; 
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: 'Please Enter something in search',
        type: "warning",
        duration: 3000,
      });
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch search results');

      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: 'Error Occurred',
        description: error.message || "Failed to load the search results",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error('Failed to access the chat');

      const data = await response.json();

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
    } catch (error) {
      toaster.create({
        title: 'Error fetching the chat',
        description: error.message || "Failed to load the search results",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoadingChat(false);
      onClose();
    }
  };

  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'white'}
        w={'100%'}
        p={'5px 10px'}
        borderWidth={'5px'}
        borderColor={'whitesmoke'}
      >
        <Tooltip content="Search Users to Chat" positioning={{ placement: "bottom-end" }}>
          <Button variant="ghost" _hover={{ bg: "whitesmoke", color: "black" }} onClick={() => setOpen(true)}>
            <i style={{ color: "black" }} className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="2" color="black">Search User</Text>
          </Button>
        </Tooltip>

        <Text textStyle="2xl" style={{ fontFamily: "Work sans" }}>
          Talk-A-Tive
        </Text>

        <div>
          <MenuRoot style={{ p: "1" }}>
            <MenuTrigger asChild>
              <Button variant="ghost" colorPalette="black" m="1" _hover={{ bg: "whitesmoke", color: "black" }}>
                <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE} />
                <i style={{ color: 'black', fontSize: '22px' }} className="fa-solid fa-bell"></i>
              </Button>
            </MenuTrigger>
            <MenuContent paddingLeft='2'>
              {!notification.length && "No new Messages"}
              {notification.map(notif => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}>
                  {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user,notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuContent>
          </MenuRoot>

          <MenuRoot style={{ p: "1" }}>
            <MenuTrigger asChild>
              <Button style={{ color: 'black' }} variant="ghost" m="1" _hover={{ bg: "whitesmoke", color: "black" }}>
                <Avatar name={user.name} src={user.pic} />
                <i style={{ color: 'black' }} className="fa-solid fa-caret-down"></i>
              </Button>
            </MenuTrigger>
            <MenuContent>
              <ProfileModal user={user}>
                <MenuItem value="new-txt">My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>

      <DrawerRoot placement={'left'} open={open} onOpenChange={(e) => setOpen(e.open)}>
        <DrawerBackdrop />
        <DrawerContent bg="white" color="black">
          <DrawerHeader borderBottomWidth={'1px'}>
            <DrawerTitle color={'black'}>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} paddingBottom={'2'}>
              <Input
                placeholder="Search by name or email"
                marginRight={'2'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : searchResult.length ? (
              searchResult
                .filter((result) => result._id !== user._id)  // Filter out the logged-in user
                .map(otherUser => (
                  <UserListItem
                    key={otherUser._id}
                    user={otherUser}
                    handleFunction={() => accessChat(otherUser._id)}
                  />
                ))
            ) : (
              <Text>No users found</Text>
            )}
          </DrawerBody>
          {loadingChat && <Spinner size="sm" display={'flex'} marginLeft={'auto'} marginRight={'8'} marginBottom={'8'} />}
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export default SideDrawer;
