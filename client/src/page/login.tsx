import { Center } from '@chakra-ui/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Auth from '../component/form/auth';

export const LoginPage = () => {
  return (
    <Center>
      <LoginForm/>
    </Center>
  );  
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required.")
});

interface LoginFormData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: LoginFormData) =>{
    console.log(data);
  }

  return(
    <Auth.Form 
      title="Login" 
      onSubmit={handleSubmit(onSubmit)}
      altLink="/register"
      linkText="Don't have an account?"
    >
      <Auth.FormInput
        id="username"
        isInvalid={errors.username}
        type="text"
        placeholder="Username"
        register={register}
        name="username"
        errorMessage={errors.username?.message}
      />

      <Auth.FormInput
        id="password"
        isInvalid={errors.password}
        type="password"
        placeholder="Password"
        register={register}
        name="password"
        errorMessage={errors.password?.message}
      />
      <Auth.Button
        isLoading={formState.isSubmitting}
        type="submit"
      >
        Login
      </Auth.Button>
    </Auth.Form>
  );
}