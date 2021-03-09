import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StoreProvider} from './store';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes } from './route/index';

const App = () => {
  return(
    <ChakraProvider>
      <StoreProvider>
        <Routes/>
      </StoreProvider>
    </ChakraProvider>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"))