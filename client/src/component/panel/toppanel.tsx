import * as React from 'react';
import { useStyleConfig, Flex, FlexProps } from '@chakra-ui/react';

interface TopPanelProps extends FlexProps {
  size?: string,
  variant?: string,
  children: React.ReactNode,
}
export const TopPanel = ({children, size, variant, ...rest}: TopPanelProps) => {
  const styles = useStyleConfig('TopPanel', {size, variant});
  return(
    <Flex
      sx={styles}
      {...rest}
    >
      {children}
    </Flex>
  );
}