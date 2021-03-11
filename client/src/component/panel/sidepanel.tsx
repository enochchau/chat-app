import * as React from 'react';
import { Box } from '@chakra-ui/react';

export const SidePanel:typeof Box = ({children, ...rest}) => {
  return(
    <Box 
      maxHeight="100vh" 
      overflowY="auto"
      {...rest}
    >
      {children}
    </Box>
  );
}