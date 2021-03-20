import { Flex, Avatar, Box, Text } from '@chakra-ui/react';
import * as React from 'react';
import { Redirect } from 'react-router';

interface SearchResultProps{
  title: string;
  avatarSrc?: string;
  groupId: number;
}
export const SearchResult = ({title, avatarSrc, groupId}: SearchResultProps) => {
  return(
    <Flex
      flexDir="row"
      onClick={(e) => <Redirect to={`/chat/${groupId}`}/>}
    >
      <Avatar size="md" name={title} src={avatarSrc}/>
      <Box>
        <Text>{title}</Text>
      </Box>
    </Flex>
  );
}