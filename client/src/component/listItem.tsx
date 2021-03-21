import { Flex, Avatar, Text, Box, useMultiStyleConfig } from '@chakra-ui/react';
import * as React from 'react';

interface ListItemProps {
  title: string;
  avatarSrc?: string | null;
  children?: React.ReactNode;
  variant?: string;
  size?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export const ListItem = ({title, avatarSrc, children, size, variant, onClick}: ListItemProps) => {
  const styles = useMultiStyleConfig('ListItem', {size, variant});
  return(
    <Flex
      onClick={onClick}
      sx={styles.container}
    >
      <Avatar sx={styles.avatar} name={title} src={avatarSrc || undefined}/>
      <Box>
        <Text sx={styles.text}>{title}</Text>
        {children}
      </Box>
    </Flex>
  );
}