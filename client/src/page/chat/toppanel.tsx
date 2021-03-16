import { Heading, Avatar, Flex, HStack, IconButton } from '@chakra-ui/react';
import { InfoIcon } from '../../component/icon';
import * as React from 'react';

interface TopAvatarPanelProps {
  username: string;
  avatarSrc?: string;
  onInfoClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TopAvatarPanel = ({username, avatarSrc, onInfoClick}: TopAvatarPanelProps) => {
  return(
    <Flex
      align="center"
      justify="space-between"
      padding="10px"
      boxShadow="base"
    >
      <HStack padding="5px">
        <Avatar name={username} src={avatarSrc} size="sm"/>
        <Heading size="sm">
          {username}
        </Heading>
      </HStack>
      <HStack padding="5px">
        <IconButton
          aria-label="See Chat Info"
          isRound
          icon={<InfoIcon fontSize="lg"/>}
          onClick={onInfoClick}
          background="none"
        />
      </HStack>
    </Flex>
  );
}