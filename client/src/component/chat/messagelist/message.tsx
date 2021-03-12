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
  useMultiStyleConfig,
  StylesProvider,
  useStyles,
} from '@chakra-ui/react';
import { SideButtons } from './sidebuttons';

interface MessageTextProps extends FlexProps{
  children: React.ReactNode;
  timestamp: Date;
  timestampPlacement: Placement;
}
const MessageText = ({timestamp, children, timestampPlacement, ...rest}: MessageTextProps) => {
  const styles = useStyles();
  return(
    <Flex
      sx={styles.text}
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
  variant: "right" | "left";
}
export const Message = ({personName, avatarSrc, children, timestamp, showAvatar, variant}: MessageProps) => {
  const styles = useMultiStyleConfig("Message", { variant })
  return(
    <Flex sx={styles.message}>
      <StylesProvider value={styles}>
        <HStack>
          { (showAvatar &&  variant==="left") && <Avatar name={personName} size="sm" src={avatarSrc}/> }
            <MessageText timestamp={timestamp} timestampPlacement={variant}>
              {children}
            </MessageText>
        </HStack>
        <SideButtons/>
      </StylesProvider>
    </Flex>
  );
}