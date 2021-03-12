import * as React from 'react';
import {
  Text,
  Flex,
  Tooltip,
  Box,
  Placement,
  HStack,
  Avatar,
  FlexProps,
} from '@chakra-ui/react';
import { SideButtons } from './sidebuttons';

interface MessageTextProps extends FlexProps{
  children: React.ReactNode;
  timestamp: Date;
  timestampPlacement: Placement;
}
const MessageText = ({timestamp, children, timestampPlacement, ...rest}: MessageTextProps) => {
  return(
    <Flex
      borderRadius="xl"
      pt="4px"
      pb="4px"
      pr="8px"     
      pl="8px"
    >
      <Tooltip 
        label={timestamp.toLocaleTimeString()} 
        fontSize='sm'
        placement={timestampPlacement}
        borderRadius="lg"
      >
        <Text fontSize="md">{children}</Text>
      </Tooltip>
    </Flex>
  );
}

interface MessageProps {
  children: React.ReactNode;
  timestamp: Date;
  avatarSrc?: string;
  showAvatar?: boolean;
  personName: string;
  timestampPlacement: "right" | "left"
}
export const Message = ({personName, avatarSrc, children, timestamp, timestampPlacement, showAvatar}: MessageProps) => {
  return(
    <Flex>
      <HStack>
        { showAvatar && <Avatar name={personName} size="sm" src={avatarSrc}/> }
        <MessageText timestamp={timestamp} timestampPlacement={timestampPlacement}>
          {children}
        </MessageText>
      </HStack>
      <SideButtons/>
    </Flex>
  );
}