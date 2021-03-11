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
  children: React.ReactNode;
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
  children: React.ReactNode;
  timestamp: Date;
}

interface LeftMessageProps extends DirectionalMessageProps {
  avatar?: string;
  personName: string;
}

export const LeftMessage = ({personName, avatar, children, timestamp}:LeftMessageProps) => {
  return(
    <Flex justify="space-between">
      <HStack>
        <Avatar name={personName} size="sm" src={avatar}/>
        <Message timestamp={timestamp} tsPlacement="left">
          {children}
        </Message>
      </HStack>
      <Spacer/>
    </Flex>
  );
}

export const RightMessage = ({children, timestamp}:DirectionalMessageProps) => {
  return(
    <Flex justify="space-between">
      <Spacer/>
      <Message timestamp={timestamp} tsPlacement="right">
        {children}
      </Message>
    </Flex>
  );
}

const Spacer = () => <Box><Box width="87px"/></Box>