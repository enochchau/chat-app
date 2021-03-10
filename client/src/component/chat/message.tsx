import * as React from 'react';
import {
  Text,
  Flex,
  Tooltip,
  Box,
  Placement,
  HStack,
  Avatar
} from '@chakra-ui/react';

interface MessageProps {
  children: string;
  timestamp: Date;
  tsPlacement: Placement;
}
export const Message = ({timestamp, children, tsPlacement}: MessageProps) => {
  return(
    <Flex
      borderRadius="xl"
      border="1px"
      pt="4px"
      pb="4px"
      pr="8px"
      pl="8px"
    >
      <Tooltip 
        label={timestamp.toLocaleTimeString()} 
        fontSize='sm'
        placement={tsPlacement}
        borderRadius="lg"
      >
        <Text fontSize="md">{children}</Text>
      </Tooltip>
    </Flex>
  );
}

interface DirectionalMessageProps{
  children: string;
  timestamp: Date;
}
export const LeftMessage = ({children, timestamp}:DirectionalMessageProps) => {
  return(
    <Flex justify="space-between">
      <HStack>
        <Avatar name="dan" size="sm" src="https://scontent.fsjc1-3.fna.fbcdn.net/v/t1.0-1/c24.33.198.198a/p240x240/67663361_2399631803645638_9161317739476811776_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=7206a8&_nc_ohc=cfz9q50SoxoAX8lpemZ&_nc_ht=scontent.fsjc1-3.fna&tp=27&oh=0fccda4857990efe2fd7a8595cd3e12c&oe=606CB318"/>
        <Message timestamp={timestamp} tsPlacement="left">
          {children}
        </Message>
      </HStack>
      <Box/>
    </Flex>
  );
}
export const RightMessage = ({children, timestamp}:DirectionalMessageProps) => {
  return(
    <Flex justify="space-between">
      <Box/>
      <Message timestamp={timestamp} tsPlacement="right">
        {children}
      </Message>
    </Flex>
  );
}