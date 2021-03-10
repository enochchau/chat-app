import * as React from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Link as ChakraLink } from '@chakra-ui/react';

export const Link:typeof ChakraLink = ({children, to, ...rest}) => <ChakraLink as={ReactRouterLink} to={to} {...rest}>{children}</ChakraLink>
