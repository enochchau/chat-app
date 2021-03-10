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