import * as React from 'react';
import {
  Text
} from '@chakra-ui/react';
import { ListItem } from '../listItem';


function timeSinceString(time: Date){
  const since = (Date.now() - Date.parse(time.toISOString()));
  const MINUTE = 60;
  const HOUR = MINUTE*60;
  const DAY = HOUR*24;
  const WEEK = DAY*7;
  const MONTH = WEEK*30;
  const YEAR = 31536000;
  if(since < MINUTE) return `${since} s`;
  if(since < HOUR) return `${Math.floor(since/MINUTE)} m`;
  if(since < DAY) return `${Math.floor(since/HOUR)} h`;
  if(since < WEEK) return `${Math.floor(since/DAY)} d`;
  if(since < MONTH) return `${Math.floor(since/WEEK)} w`;
  if(since < YEAR) return `${Math.floor(since/MONTH)} m`;
  else return `${Math.floor(since/YEAR)} y`
}

interface GroupItemProps {
  title: string;
  avatarSrc?: string;
  lastMessage?: string;
  lastTimestamp?: Date;
}
export const GroupItem = ({title, avatarSrc, lastMessage, lastTimestamp}: GroupItemProps) => {
  return(
    <ListItem
      title={title}
      avatarSrc={avatarSrc}
    >
      {lastMessage && lastTimestamp && 
        <Text>{lastMessage}·{timeSinceString(lastTimestamp)}</Text>
      }
    </ListItem>
  );
}