import * as React from 'react';
import { 
  FormControl, 
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { FieldError } from 'react-hook-form';


interface FormInputProps {
  id: string;
  isInvalid?: boolean;
  label: string;
  type: string;
  placeholder: string;
  register: React.LegacyRef<HTMLInputElement>;
  name: string;
  errorMessage?: string;
}
export const FormInput = ({
  id, 
  isInvalid, 
  label,
  type, 
  placeholder, 
  register, 
  name, 
  errorMessage 
}: FormInputProps) => {
  return(
    <FormControl 
      id={id} 
      isInvalid={isInvalid}
    >
      <FormLabel>{label}</FormLabel>
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