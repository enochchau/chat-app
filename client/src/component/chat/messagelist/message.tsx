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
const MessageText: React.FC<MessageTextProps> = ({timestamp, children, timestampPlacement}) => {
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
  variant: "right" | "left" | 'removedLeft' | 'removedRight';
  size?: string;
  showName?: boolean;
  messageId: number;
  onRemoveClick: (_e: React.MouseEvent<HTMLButtonElement>, _id: number) => void;
}
export const Message: React.FC<MessageProps> = ({
  personName, 
  avatarSrc, 
  children, 
  timestamp, 
  showAvatar, 
  variant, 
  showName, 
  size, 
  messageId,
  onRemoveClick,
}) => {
  const styles = useMultiStyleConfig("Message", { variant, size })

  const handleRemoveClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onRemoveClick(e, messageId);
  }

  return(
    <Flex
      flexDir="column"
    >
      {showName && 
        <Text sx={styles.name}>{personName}</Text>
      }
      <Flex sx={styles.message}>
        <StylesProvider value={styles}>
          <HStack>
            {
              variant==="left"
              && (showAvatar 
                ? <Avatar name={personName} size="sm" src={avatarSrc}/>
                : <Box height="32px" width="32px"/>
              )
            }
            <MessageText timestamp={timestamp} timestampPlacement={variant === "removedLeft" ? 'left' : variant === 'removedRight' ? 'right' : variant}>
              {children}
            </MessageText>
          </HStack>
          {variant==='right' && 
            <SideButtons
              onRemoveClick={handleRemoveClick}
            />
          }
        </StylesProvider>
      </Flex>
    </Flex>
  );
}