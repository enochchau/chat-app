import * as React from 'react';
import { Center } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Auth from '../component/form/auth';
import axios from 'axios';
import { REGISTER } from '../api';

export const RegisterPage = () => {
  return(
    <Center>
      <RegisterForm/>
    </Center>
  )
}

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required."),
  rePassword: yup.string()
    .required("Please confirm your password.")
    .oneOf([yup.ref('password'), null], 'Passwords must match.'),
  name: yup.string().required("Name is required.")
})

interface RegisterFormData {
  username: string;
  password: string;
  rePassword: string;
  name: string;
}

const RegisterForm = () =>  {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: RegisterFormData) =>{
    console.log(data);
    axios.post(REGISTER, data)
      .then((res) => {
        console.log(res.data.message);
        // saveToken(res)
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return(
    <Auth.Form 
      title="Register" 
      onSubmit={handleSubmit(onSubmit)}
      altLink="/login"
      linkText="Already have an account?"
    >
      <Auth.FormInput
        id="name"
        label="Name"
        isInvalid={Boolean(errors.name)}
        type="text"
        placeholder="Name"
        register={register}
        name="name"
        errorMessage={errors.name?.message}
      />

      <Auth.FormInput
        id="username"
        label="Username"
        isInvalid={Boolean(errors.username)}
        type="text"
        placeholder="Username"
        register={register}
        name="username"
        errorMessage={errors.username?.message}
      />

      <Auth.FormInput
        id="password"
        label="Password"
        isInvalid={Boolean(errors.password)}
        type="password"
        placeholder="Password"
        register={register}
        name="password"
        errorMessage={errors.password?.message}
      />

      <Auth.FormInput
        id="rePassword"
        label="Re-type Password"
        isInvalid={Boolean(errors.rePassword)}
        type="password"
        placeholder="Re-type Password"
        register={register}
        name="rePassword"
        errorMessage={errors.rePassword?.message}
      />

      <Auth.Button
        isLoading={formState.isSubmitting}
        type="submit"
      >
        Register
      </Auth.Button>
    </Auth.Form>
  );
}