import * as React from 'react';
import { Center, useToast } from '@chakra-ui/react';
import * as t from 'io-ts';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { AuthRequest } from '../api/auth';
import { decodeToJwtUser, saveToken } from '../api/token';
import { StoreContext } from '../store';

import * as Auth from '../component/auth';
import { ServerError, BadLogin, GoodLogin } from '../component/toast';
import { Redirect } from 'react-router-dom';
import { AuthData, TokenData } from 'api/validators/auth';

export const LoginPage = () => {
  return (
    <Center>
      <LoginForm/>
    </Center>
  );  
}

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email.").required("Email is required."),
  password: yup.string().required("Password is required.")
});

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface ResponseData {
  token?: string;
  message: string;
}

const LoginForm = () => {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });

  const [formAccepted, setFormAccepted] = React.useState<boolean>(false);

  // use toast for error handling
  const toastMessage = useToast();
  
  const {storeState, storeDispatch} = React.useContext(StoreContext);

  const onSubmit = (data: LoginFormData) =>{
    const rememberMe = data.rememberMe;
    // reformat data to post
    const postData = {
      email: data.email,
      password: data.password,
    };
    // post data

    // on validation fail
    const onLeft = (errors: t.Errors) => console.error('Failed to validate login response: ',errors, '\nOne failure is ok as long as we are still authenticated.');

    const onNoTokenRight = (data: AuthData) => {
      toastMessage(BadLogin(data.message));
    }

    const onTokenRight = (data: TokenData) => {
      const jwtUser = decodeToJwtUser(data.token);
      if(jwtUser){
        toastMessage(GoodLogin(data.message));
        saveToken(data.token, rememberMe);
        storeDispatch({type: 'store current user', payload: jwtUser});
        setFormAccepted(true);
      }
    }

    const onError = (error: Error) => {
      toastMessage(ServerError);
      console.error(error);
    }

    AuthRequest.postLogin(postData, onLeft, onNoTokenRight, onLeft, onTokenRight, onError);
  }

  // redirect link is currently a placeholder
  return(
    formAccepted
    ? <Redirect to="/"/>
    :
    <Auth.Form 
      title="Login" 
      onSubmit={handleSubmit(onSubmit)}
      altLink="/register"
      linkText="Don't have an account?"
    >
      <Auth.EmailFormInput
        isInvalid={Boolean(errors.email)}
        register={register}
        errorMessage={errors.email?.message}
      />
      
      <Auth.PasswordFormInput
        isInvalid={Boolean(errors.password)}
        register={register}
        errorMessage={errors.password?.message}
      />

      <Auth.RememberMe register={register} />
      <Auth.Button
        isLoading={formState.isSubmitting}
        type="submit"
      >
        Submit
      </Auth.Button>
    </Auth.Form>
  );
}