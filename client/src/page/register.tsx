import * as React from 'react';
import { Center, useToast } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as Auth from '../component/auth';
import axios from 'axios';
import { REGISTER } from '../api/api';

import { BadRegister, GoodRegister, ServerError } from '../component/toast';
import { Redirect } from 'react-router-dom';

import { FontIcon , RedoIcon } from '../component/icon';

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
  email: string;
}
interface RequestData {
  username: string;
  password: string;
  email: string;
}

interface ResponseData {
  message: string;
}

const RegisterForm = () =>  {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });
  const [formAccepted, setFormAccepted] = React.useState<boolean>(false);

  const toastMessage = useToast();

  const onSubmit = (formData: RegisterFormData) =>{
    // reformat data!!
    const reqData: RequestData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
    }
    axios.post(REGISTER, reqData)
      .then((res) => res.data as ResponseData)
      .then((data) => {
        if (data.message.toLowerCase().includes("successful")){
          toastMessage(GoodRegister);
          setFormAccepted(true);
        } else {
          toastMessage(BadRegister(data.message));
        }
      })
      .catch((err) => {
        // console.error(err);
        toastMessage(ServerError);
      });
  }

  return(
    formAccepted
      ? <Redirect to="/login"/>
      :
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
          icon={<FontIcon/>}
        />

        <Auth.UsernameFormInput
          isInvalid={Boolean(errors.username)}
          register={register}
          errorMessage={errors.username?.message}
        />
        
        <Auth.PasswordFormInput
          isInvalid={Boolean(errors.password)}
          register={register}
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
          icon={<RedoIcon/>}
        />

        <Auth.Button
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Submit
        </Auth.Button>
      </Auth.Form>
  );
}