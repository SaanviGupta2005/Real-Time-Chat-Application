import React from 'react'
import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "../components/ui/skeleton"
import { HStack, Stack, VStack } from "@chakra-ui/react"

const ChatLoading = () => {
  return (
      <>
          <HStack gap="5">
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
    </>
  )
}

export default ChatLoading
