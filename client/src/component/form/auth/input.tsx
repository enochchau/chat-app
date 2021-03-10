import * as React from 'react';
import { 
  FormControl, 
  FormErrorMessage, 
  Input,
} from '@chakra-ui/react';
import { childPadding } from './form';


interface FormInputProps {
  id: string;
  isInvalid?: boolean;
  type: string;
  placeholder: string;
  register: React.LegacyRef<HTMLInputElement>;
  name: string;
  errorMessage?: string;
}
export const FormInput = ({
  id, 
  isInvalid, 
  type, 
  placeholder, 
  register, 
  name, 
  errorMessage 
}: FormInputProps) => {
  return(
    <FormControl 
      padding={childPadding}
      id={id} 
      isInvalid={isInvalid}
    >
      <Input 
        type={type} 
        placeholder={placeholder} 
        ref={register}
        name={name}
      />
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}