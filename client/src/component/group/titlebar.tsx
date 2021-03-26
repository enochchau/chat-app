import { 
  Avatar,
  Heading,
  IconButton,
  HStack,
  Box,
  useMultiStyleConfig,
  Tooltip
} from '@chakra-ui/react';
import * as React from 'react';
import { GithubIcon, EditIcon, SignOutIcon } from '../icon';

interface TitleBarProps {
  avatarSrc?: string;
  username: string;
  title: string;
  onEllipsisClick: React.MouseEventHandler<HTMLButtonElement>;
  onGithubClick: React.MouseEventHandler<HTMLButtonElement>;
  onEditClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TitleBar: React.FC<TitleBarProps> = ({
  title, 
  username, 
  avatarSrc, 
  onEllipsisClick,
  onGithubClick,
  onEditClick,
}: TitleBarProps) => {
  const styles = useMultiStyleConfig("TitleBar", {});
  return(
    <Box
      sx={styles.container}
    >
      <HStack>
        <Avatar name={username} src={avatarSrc} size="sm"/>
        <Heading sx={styles.title}>{title}</Heading>
      </HStack>
      <HStack>
        <Tooltip label="Sign Out">
          <IconButton
            aria-label="Sign out"
            icon={<SignOutIcon sx={styles.icon}/>}
            onClick={onEllipsisClick}
            isRound
            size="md"
            fontSize="md"
            sx={styles.iconButton}
          />
        </Tooltip>
        <Tooltip label="Github">
          <IconButton
            aria-label="Github"
            icon={<GithubIcon sx={styles.icon}/>}
            onClick={onGithubClick}
            isRound
            size="md"
            fontSize="md"
            sx={styles.iconButton}
          />
        </Tooltip>
        <Tooltip label="New Group">
          <IconButton
            aria-label="New Group"
            icon={<EditIcon sx={styles.icon}/>}
            onClick={onEditClick}
            isRound
            size="md"
            fontSize="md"
            sx={styles.iconButton}
          />
        </Tooltip>
      </HStack>
    </Box>
  );
}