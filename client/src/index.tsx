import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StoreProvider} from './store';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes } from './route/index';
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import { IconButton, Message } from './theme'

// there is only 1 break point for the left panel
const breakpoints = createBreakpoints({
  sm: "900px",
  md: "900000px",
  lg: "900000px",
  xl: "900000px"
})

const theme = extendTheme({
  breakpoints,
  components: {
    IconButton, Message
  }
});

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