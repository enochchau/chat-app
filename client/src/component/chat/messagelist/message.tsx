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

function getTimeString(timestamp: Date): string{
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const getHHMM = (timestamp: Date):string => `${timestamp.getHours()}:${(timestamp.getMinutes() < 10 ? '0' : '') + timestamp.getMinutes()}`

  // if within the current day = HH:MM
  if( now.toDateString() === timestamp.toDateString() ) return getHHMM(timestamp);
  // if within the current week of the same month = Weekday HH:MM
  if( now.getDate() - timestamp.getDate() < 7 && now.getMonth() === timestamp.getMonth() ) {
    return `${days[timestamp.getDay()]} ` + getHHMM(timestamp);
  }
  // else = dd MONTHNAME yyyy HH:MM
  return `${timestamp.getDate()} ${monthNames[timestamp.getMonth()]} ${timestamp.getFullYear()} ` + getHHMM(timestamp);
}

interface MessageTextProps extends FlexProps{
  children: React.ReactNode;
  timestamp: Date;
  timestampPlacement: Placement;
}
const MessageText = ({timestamp, children, timestampPlacement, ...rest}: MessageTextProps) => {
  const styles = useStyles();
  const timeString = getTimeString(timestamp);
  return(
    <Flex
      sx={styles.text}
    >
      <Tooltip 
        label={timeString}
        placement={timestampPlacement}
      >
        <Text wordBreak="break-word" fontSize="md">{children}</Text>
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
          {
            variant==="left"
            && (showAvatar 
              ? <Avatar name={personName} size="sm" src={avatarSrc}/>
              : <Box height="32px" width="32px"/>
          )}
          <MessageText timestamp={timestamp} timestampPlacement={variant}>
            {children}
          </MessageText>
        </HStack>
        <SideButtons/>
      </StylesProvider>
    </Flex>
  );
}