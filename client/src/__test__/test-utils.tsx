import * as React from 'react';
import { StoreProvider } from '../store';
import { ChakraProvider } from '@chakra-ui/react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter as Router} from 'react-router-dom';

const AllTheProviders: React.FC = ({children}) => {
  return(
    <StoreProvider>
      <ChakraProvider>
        <Router>
          {children}
        </Router>
      </ChakraProvider>
    </StoreProvider>
  );
}

const customRender = (
  ui: React.ReactElement ,
  options?: Omit<RenderOptions , 'queries'>
) => render(ui, {wrapper: AllTheProviders, ...options})

export * from '@testing-library/react'

export { customRender as render }