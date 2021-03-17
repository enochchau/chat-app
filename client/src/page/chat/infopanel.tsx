import * as React from 'react';
import { SidePanel } from '../../component/panel/sidepanel';
import {
  Box,
} from '@chakra-ui/react';

export const InfoPanel = () => {
  return(
    <SidePanel variant="rightPanel">
      <Box height="1300px"></Box>
    </SidePanel>
  );
}

