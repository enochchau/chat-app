import * as React from 'react';
import { 
  FormControl, 
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { UserIcon, LockIcon } from '../icon'


interface FormInputProps {
  id: string;
  isInvalid?: boolean;
  label: string;
  type: string;
  placeholder: string;
  register: React.LegacyRef<HTMLInputElement>;
  name: string;
  errorMessage?: string;
  icon: React.ReactNode;
}
export const FormInput = ({
  id, 
  isInvalid, 
  label,
  type, 
  placeholder, 
  register, 
  name, 
  errorMessage,
  icon
}: FormInputProps) => {
  return(
    <FormControl 
      id={id} 
      isInvalid={isInvalid}
    >
      <FormLabel fontSize="sm">{label}</FormLabel>
      <InputGroup>
        <InputLeftElement
          children={icon}
        />
        <Input 
          type={type} 
          placeholder={placeholder} 
          ref={register}
          name={name}
        />
      </InputGroup>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
}

interface PremadeFormInputProps {
  isInvalid: boolean;
  register: React.LegacyRef<HTMLInputElement>;
  errorMessage?: string;

}
export const UsernameFormInput = ({isInvalid, register, errorMessage}: PremadeFormInputProps) => {
  return(
    <FormInput
      id="username"
      label="Username"
      isInvalid={isInvalid}
      type="text"
      placeholder="Username"
      register={register}
      name="username"
      errorMessage={errorMessage}
      icon={<UserIcon/>}
    />
  );
}

export const PasswordFormInput = ({isInvalid, register, errorMessage}: PremadeFormInputProps) => {
  return(
    <FormInput
      id="password"
      label="Password"
      isInvalid={isInvalid}
      type="password"
      placeholder="Password"
      register={register}
      name="password"
      errorMessage={errorMessage}
      icon={<LockIcon/>}
    />
  );
}