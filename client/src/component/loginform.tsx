import * as React from 'react';
import { 
  Button,
  FormControl, 
  FormErrorMessage, 
  Input 
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required.")
});

interface LoginFormData {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: LoginFormData) =>{
    console.log(data);
  }

  return(
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="username" isInvalid={errors.username}>
        <Input 
          type='text' 
          placeholder="Username" 
          ref={register}
          name="username"
        />
      <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
      </FormControl>

      <FormControl id="password" isInvalid={errors.password}>
        <Input 
          type='password'
          placeholder="Password"
          ref={register}
          name="password"
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <Button isLoading={formState.isSubmitting} type="submit">
        Login
      </Button>
    </form>
  );
}