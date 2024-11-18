import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
      <Box
          paddingX={2}
      paddingY={1}
      borderRadius="lg"
      margin={1}
      marginBottom={2}
      variant="solid"
      fontSize={12}
          colorScheme="purple"
          backgroundColor={'purple'}
          color={'white'}
      cursor="pointer"
      onClick={handleFunction}
      >
      {user.name}
      {admin === user._id && <span> (Admin)</span>} 🗑️
    </Box>
  )
}

export default UserBadgeItem
