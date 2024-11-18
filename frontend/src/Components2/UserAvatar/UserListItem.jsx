import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Text } from '@chakra-ui/react';
import { Avatar } from "../../components/ui/avatar";

const UserListItem = ({ user, handleFunction }) => {
  if (!user) {
    return null; // or display a loading or fallback UI
  }

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        bg: "#38B2AC",
        color: "white",
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      paddingX={3}
      paddingY={2}
      marginBottom={2}
      borderRadius="lg"
    >
      <Avatar
        marginRight={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text fontSize={'sm'}>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem
