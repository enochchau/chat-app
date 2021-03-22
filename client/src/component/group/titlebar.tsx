import { 
  Avatar,
  Heading,
  IconButton,
  HStack,
  Box,
  useMultiStyleConfig,
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
        <IconButton
          aria-label="Account Options"
          icon={<EllipsisVIcon sx={styles.icon}/>}
          onClick={onEllipsisClick}
          isRound
          sx={styles.iconButton}
        />
        <IconButton
          aria-label="Github"
          icon={<GithubIcon sx={styles.icon}/>}
          onClick={onGithubClick}
          isRound
          sx={styles.iconButton}
        />
        <IconButton
          aria-label="New Group"
          icon={<EditIcon sx={styles.icon}/>}
          onClick={onEditClick}
          isRound
          sx={styles.iconButton}
        />
      </HStack>
    </Box>
  );
}