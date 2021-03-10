import * as React from 'react';
import {
  Center,
  chakra, 
  Heading, 
  Text
} from '@chakra-ui/react';
import { Link } from '../../route';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement>{
  children: React.ReactNode;
  title?: string;
  altLink?:string;
  linkText?:string;
}

export const childPadding = "5px";

export const Form = ({children, title, altLink, linkText, ...rest}: FormProps) => {
  return(
    <chakra.form 
      {...rest}
      padding="10px"
      boxShadow="base"
    >
      {title && <Heading size="lg" padding={childPadding}>{title}</Heading>}
      {children}
      {altLink && linkText && 
        <Center>
          <Link fontSize="xs" padding={childPadding} to={altLink}>{linkText}</Link>
        </Center>
      }
    </chakra.form>
  );
}
