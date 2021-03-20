import { Center, Image } from '@chakra-ui/react';
import * as React from 'react';
import { Link } from '../component/route';

export const LandingPage = () => {
  return(
    <Center>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/chat">Chat</Link>
    </Center>
  );
}