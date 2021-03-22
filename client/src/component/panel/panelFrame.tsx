import { Box, useStyleConfig } from '@chakra-ui/react';
import * as React from 'react';

interface PanelFrameProps {
  variant?: string,
  size?: string,
  children?: React.ReactNode,
}
export const PanelFrame: React.FC<PanelFrameProps> = ({size, variant, children}) => {
  const styles = useStyleConfig("PanelFrame", {variant, size});

  return(
    <Box sx={styles}>{children}</Box>
  );
}