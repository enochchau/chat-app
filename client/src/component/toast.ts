import { UseToastOptions } from "@chakra-ui/toast";

export const ServerError: UseToastOptions =  {
  title: "Server Error",
  description: "Something went wrong. Wait a bit and try again.",
  status: 'error',
  duration: 5000,
  isClosable: true,
};

export const BadLogin = (description: string): UseToastOptions => {
  return({
    title: "Invalid Credentials",
    description: description,
    status: 'warning',
    duration: 5000,
    isClosable: true,
  });
};

export const GoodLogin = (description: string): UseToastOptions => {
  return({
    title: "Valid Credentials",
    description: description,
    status: "success",
    duration: 5000,
    isClosable: true,
  });
};

export const GoodRegister: UseToastOptions =  {
  title: "Registration Accepted",
  description: `You will be redirected in a moment.`,
  status: "success",
  duration: 5000,
  isClosable: true,
}

export const BadRegister = (description: string): UseToastOptions => {
  return({
    title: "Registration Denied",
    description: description,
    status: "warning",
    duration: 5000,
    isClosable: true,
  });
}