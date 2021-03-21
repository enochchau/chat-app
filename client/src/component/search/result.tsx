import { Flex, Avatar, Box, Text } from '@chakra-ui/react';
import * as React from 'react';

interface SearchResultProps{
  title: string;
  avatarSrc?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export const SearchResult = ({title, avatarSrc, onClick}: SearchResultProps) => {
  return(
    <Flex
      flexDir="row"
      onClick={onClick}
    >
      <Avatar size="md" name={title} src={avatarSrc}/>
      <Box>
        <Text>{title}</Text>
      </Box>
    </Flex>
  );
}