import 'regenerator-runtime/runtime';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'emoji-mart/css/emoji-mart.css'
import { StoreProvider} from './store';
import { ChakraProvider } from '@chakra-ui/react';
import { Routes } from './route/index';
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
import { 
  Icon, 
  Message, 
  Tooltip, 
  Form, 
  SidePanel,
  TopPanel,
  ListItem,
} from './theme'


// there is only 1 break point for the left panel
const breakpoints = createBreakpoints({
  sm: "0px",
  md: "900px",
  lg: "900000px",
  xl: "900000px"
})

const theme = extendTheme({
  breakpoints,
  components: {
    Icon, 
    Message, 
    Tooltip, 
    Form,
    SidePanel,
    TopPanel,
    ListItem
  }
});

const App = () => {
  return(
    <ChakraProvider theme={theme}>
      <StoreProvider>
        <Routes/>
      </StoreProvider>
    </ChakraProvider>
  );
}

ReactDOM.render(<App/>, document.getElementById("root"))