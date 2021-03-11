import * as React from 'react';
import {
  Text,
  Flex,
  Tooltip,
  Box,
  Placement,
  HStack,
  Avatar,
  FlexProps
} from '@chakra-ui/react';

interface MessageProps extends FlexProps{
  children: React.ReactNode;
  timestamp: Date;
  tsPlacement: Placement;
}
const Message = ({timestamp, children, tsPlacement, ...rest}: MessageProps) => {
  return(
    <Flex
      borderRadius="xl"
      pt="4px"
      pb="4px"
      pr="8px"
      pl="8px"
      {...rest}
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
  marginBottom?: string;
}

interface LeftMessageProps extends DirectionalMessageProps {
  avatar?: string;
  showAvatar: boolean;
  personName: string;
}

export const LeftMessage = ({personName, avatar, children, timestamp, marginBottom, showAvatar}:LeftMessageProps) => {
  return(
    <Flex justify="space-between" marginBottom={marginBottom} marginLeft={!showAvatar ? "40px" : "0px"}>
      <HStack>
        { showAvatar && <Avatar name={personName} size="sm" src={avatar}/> }
        <Message timestamp={timestamp} tsPlacement="left" backgroundColor="gray.300" color="black">
          {children}
        </Message>
      </HStack>
      <Spacer/>
    </Flex>
  );
}

export const RightMessage = ({children, timestamp, marginBottom}:DirectionalMessageProps) => {
  return(
    <Flex justify="space-between" marginBottom={marginBottom}>
      <Spacer/>
      <Message timestamp={timestamp} tsPlacement="right" backgroundColor="blue.400" color="white" mr="15px">
        {children}
      </Message>
    </Flex>
  );
}

const Spacer = () => <Box><Box width="87px"/></Box>