import * as React from 'react';
import { useStyleConfig, Flex } from '@chakra-ui/react';

interface TopPanelProps {
  size?: string,
  variant?: string,
  children: React.ReactNode
}
export const TopPanel = ({children, size, variant}: TopPanelProps) => {
  const styles = useStyleConfig('TopPanel', {size, variant});
  return(
    <Flex
      sx={styles}
    >
      {children}
    </Flex>
  );
}