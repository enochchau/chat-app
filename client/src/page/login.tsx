import { Center, useToast } from '@chakra-ui/react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { LOGIN } from '../api';
import { decodeToJwtUser, saveToken } from '../api/token';
import * as Auth from '../component/form/auth';
import { ServerError, BadLogin } from '../component/toast';
import { StoreContext } from '../store';

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
  rememberMe: boolean;
}

const LoginForm = () => {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });
  // use toast for error handling
  const errorHandler = useToast();
  
  const {storeState, storeDispatch} = React.useContext(StoreContext);

  const onSubmit = (data: LoginFormData) =>{
    const rememberMe = data.rememberMe;
    // reformat data to post
    const postData = {
      username: data.username,
      password: data.password,
    };
    // post data
    axios.post(LOGIN, postData)
      .then((res) => {
        const jwtUser = decodeToJwtUser(res.data);

        if(!jwtUser){
          errorHandler(BadLogin(res.data.message));
        } else {
          saveToken(res.data, rememberMe);
          storeDispatch({type: 'store current user', payload: jwtUser})
        }
      })
      .catch((error) => {
        errorHandler(ServerError);
      });
      
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
      <Auth.RememberMe register={register}/>
      <Auth.Button
        isLoading={formState.isSubmitting}
        type="submit"
      >
        Login
      </Auth.Button>
    </Auth.Form>
  );
}