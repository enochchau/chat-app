import * as React from 'react';
import { ChatApp } from '../component/chat';
import { Box, Flex } from '@chakra-ui/react';

// the middle box should have flex
export const ChatPage = () => {
  return(
    <Flex
      maxHeight="100vh"
      maxWidth="100vw"
      flexDirection="row"
      align="stretch"
      justify="space-between"
      overflowX="hidden"
      overflowY="hidden"
    >
      <Box>
        <Box width={{sm: '84px', md:"360px"}} maxHeight="100vh" border="1px" overflowY="auto">
          <Box height="1300px"></Box>
        </Box>
      </Box>
      <ChatApp/>
      <Box>
        <Box width="249px" maxHeight="100vh" border="1px" overflowY="auto">
          <Box height="1300px"></Box>
        </Box>
      </Box>

    </Flex>
  );
}