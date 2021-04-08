import { Flex, Avatar, Text, Box, useMultiStyleConfig } from '@chakra-ui/react';
import * as React from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  avatarSrc?: string | null;
  avatarSize?:string;
  variant?: string;
  size?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export const ListItem: React.FC<ListItemProps> = ({title, subtitle, avatarSrc, size, variant, onClick, avatarSize}: ListItemProps) => {
  const styles = useMultiStyleConfig('ListItem', {size, variant});
  return(
    <Flex
      onClick={onClick}
      sx={styles.container}
    >
      <Avatar size={avatarSize} sx={styles.avatar} name={title} src={avatarSrc || undefined}/>
      <Box >
        <Text sx={styles.title}>{title}</Text>
        {subtitle && <Text sx={styles.subtitle}>{subtitle}</Text>}
      </Box>
    </Flex>
  );
}

interface ListItemProps {
  title: string;
  subtitle?: string;
  avatarSize?:string;
  variant?: string;
  size?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: React.ReactNode;
}
export const ListItemIcon: React.FC<ListItemProps> = ({title, subtitle, size, variant, onClick, icon}: ListItemProps) => {
  const styles = useMultiStyleConfig('ListItem', {size, variant});
  return(
    <Flex
      onClick={onClick}
      sx={styles.container}
    >
      {icon}
      <Box >
        <Text sx={styles.title}>{title}</Text>
        {subtitle && <Text sx={styles.subtitle}>{subtitle}</Text>}
      </Box>
    </Flex>
  );
}