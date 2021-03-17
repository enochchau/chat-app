import * as React from 'react';
import { Box, useStyleConfig } from '@chakra-ui/react';

interface SidePanelProps{
  children?: React.ReactNode,
  size?: string,
  variant?: string,
}
export const SidePanel = ({children, size, variant}: SidePanelProps) => {
  const styles = useStyleConfig("SidePanel", {size, variant});
  return(
    <Box 
      maxHeight="100vh" 
      overflowY="auto"
      sx={styles}
    >
      {children}
    </Box>
  );
}