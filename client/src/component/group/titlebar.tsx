import { 
  Avatar,
  Heading,
  IconButton,
  HStack,
  Flex,
} from '@chakra-ui/react';
import * as React from 'react';
import { EllipsisVIcon, GithubIcon, EditIcon } from '../icon';

interface TitleBarProps {
  avatarSrc?: string;
  username: string;
  title: string;
  onEllipsisClick: React.MouseEventHandler<HTMLButtonElement>;
  onGithubClick: React.MouseEventHandler<HTMLButtonElement>;
  onEditClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TitleBar = ({
  title, 
  username, 
  avatarSrc, 
  onEllipsisClick,
  onGithubClick,
  onEditClick,
}: TitleBarProps) => {
  return(
    <Flex 
      display={{sm: 'none', md: "flex"}}
      flexDir="row" 
      justify="space-between" 
      align="center"
    >
      <HStack>
        <Avatar name={username} src={avatarSrc} size="md"/>
        <Heading>{title}</Heading>
      </HStack>
      <HStack>
        <IconButton
          aria-label="Account Options"
          icon={<EllipsisVIcon/>}
          onClick={onEllipsisClick}
          isRound
        />
        <IconButton
          aria-label="Github"
          icon={<GithubIcon/>}
          onClick={onGithubClick}
          isRound
        />
        <IconButton
          aria-label="New Group"
          icon={<EditIcon/>}
          onClick={onEditClick}
          isRound
        />
      </HStack>
    </Flex>
  );
}