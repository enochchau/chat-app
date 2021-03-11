import { Heading, Avatar, Flex, HStack, IconButton } from '@chakra-ui/react';
import { InfoIcon } from '../icon';
import * as React from 'react';

interface TopAvatarPanelProps {
  name: string;
  avatarSrc?: string;
  onInfoClick: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}
export const TopAvatarPanel = ({name, avatarSrc, onInfoClick}: TopAvatarPanelProps) => {
  return(
    <Flex
      align="center"
      justify="space-between"
      padding="10px"
    >
      <HStack padding="5px">
        <Avatar name={name} src={avatarSrc} size="md"/>
        <Heading size="md">
          {name}
        </Heading>
      </HStack>
      <HStack padding="5px">
        <IconButton
          aria-label="See Chat Info"
          isRound
          icon={<InfoIcon fontSize="lg" onClick={onInfoClick}/>}
        />
      </HStack>
    </Flex>
  );
}