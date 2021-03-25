import { Text, useMultiStyleConfig, useStyleConfig, Box, Heading } from '@chakra-ui/react';
import * as React from 'react';
import { XIcon } from './icon';

interface ClosableTextProps{
  children: React.ReactNode;
  size?: string;
  variant?: string;
  onXClick: React.MouseEventHandler<HTMLElement>;
}
export const ClosableText: React.FC<ClosableTextProps> = ({children, size, variant, onXClick}) => {
  const styles = useMultiStyleConfig('ClosableText', {size, variant})
  const iconStyle = useStyleConfig('Icon', {size: 'smallText' })
  return(
    <Box sx={styles.container}>
      <Heading size='xs' sx={styles.text}>{children}</Heading>
      <XIcon onClick={onXClick} sx={iconStyle}/>
    </Box>
  );
}