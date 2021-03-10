import * as React from 'react';
import {
  Center,
  chakra, 
  Heading, 
  VStack
} from '@chakra-ui/react';
import { Link } from '../route';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement>{
  children: React.ReactNode;
  title?: string;
  altLink?:string;
  linkText?:string;
}

export const Form = ({children, title, altLink, linkText, ...rest}: FormProps) => {
  return(
    <chakra.form 
      {...rest}
      padding="20px"
      boxShadow="base"
    >
      <VStack align="stretch">
        {title && <Heading size="lg">{title}</Heading>}
        {children}
        {altLink && linkText && 
          <Center>
            <Link fontSize="xs" to={altLink}>{linkText}</Link>
          </Center>
        }
      </VStack>
    </chakra.form>
  );
}
