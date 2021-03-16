import * as React from 'react';
import {
  Center,
  chakra, 
  Heading, 
  VStack,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import { Link } from '../route';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement>{
  children: React.ReactNode;
  title?: string;
  altLink?:string;
  linkText?:string;
  size?: string;
  variant? : string;
}

export const Form = ({children, title, altLink, linkText, size, variant, ...rest}: FormProps) => {
  const styles = useMultiStyleConfig("Form", {size, variant})
  return(
    <chakra.form 
      {...rest}
      sx={styles.form}
    >
      <VStack align="stretch">
        {title && <Heading sx={styles.title}>{title}</Heading>}
        {children}
        {altLink && linkText && 
          <Center>
            <Link sx={styles.altLink} to={altLink}>{linkText}</Link>
          </Center>
        }
      </VStack>
    </chakra.form>
  );
}
