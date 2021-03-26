import * as React from 'react';
// auth form
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Auth from '../component/auth';
import { FontIcon , RedoIcon } from '../component/icon';
// toast messages
import { BadRegister, GoodRegister, ServerError } from '../component/toast';
import { Center, useToast } from '@chakra-ui/react';
// redirect
import { Redirect } from 'react-router-dom';
// api/ validation
import { AuthRequest } from '../api';
import { AuthData, AuthValidator } from '../api/validators/auth';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';

export const RegisterPage: React.FC = () => {
  return(
    <Center>
      <RegisterForm/>
    </Center>
  )
}

const schema = yup.object().shape({
  email: yup.string().email("Please enter a valid email.").required("Email is required."),
  password: yup.string().required("Password is required."),
  rePassword: yup.string()
    .required("Please confirm your password.")
    .oneOf([yup.ref('password'), null], 'Passwords must match.'),
  name: yup.string().required("Name is required.")
})

interface RegisterFormData {
  name: string;
  password: string;
  rePassword: string;
  email: string;
}
interface RequestData {
  name: string;
  password: string;
  email: string;
}

const RegisterForm: React.FC = () =>  {
  const { handleSubmit, errors, register, formState } = useForm({
    resolver: yupResolver(schema)
  });
  const [formAccepted, setFormAccepted] = React.useState<boolean>(false);

  const toastMessage = useToast();

  const onSubmit = (formData: RegisterFormData): void =>{
    // reformat data!!
    const reqData: RequestData = {
      name: formData.name,
      password: formData.password,
      email: formData.email,
    }

    // post data

    AuthRequest.postRegister(reqData)
      .then(res => res.data)
      .then(data => {
        // on validation fail
        const onLeft = (errors: t.Errors): void => console.error("Validation error at post register: ", errors);

        // on validation success
        const onRight = (data: AuthData): void => {
          if (data.message.toLowerCase().includes("successful")){
            toastMessage(GoodRegister);
            setFormAccepted(true);
          } else {
            toastMessage(BadRegister(data.message));
          }
        }
        pipe(AuthValidator.decode(data), fold(onLeft, onRight));
      })
      .catch(_err => {
        toastMessage(ServerError);
      })
    
  }

  return(
    formAccepted
      ? <Redirect to="/"/>
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