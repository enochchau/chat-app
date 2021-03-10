import * as React from 'react';
import { Checkbox } from '@chakra-ui/react'

interface RememberMeProps {
  register: React.LegacyRef<HTMLInputElement>
}
export const RememberMe = ({register}: RememberMeProps) => 
  <Checkbox name="rememberMe" ref={register}>Remember Me</Checkbox>;
