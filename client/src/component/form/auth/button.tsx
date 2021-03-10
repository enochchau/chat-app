import * as React from 'react';
import { childPadding } from './form';
import {
  Button as ChakraButton
} from '@chakra-ui/react';

interface ButtonProps {
  isLoading?: boolean;
  type?: "button" | "submit" | "reset"
  children: React.ReactNode
}
export const Button = ({
  isLoading,
  type,
  children
}: ButtonProps) => {
  return(
    <ChakraButton
      isLoading={isLoading}
      type={type}
      margin={childPadding}
    >
      {children}
    </ChakraButton>
  );
}