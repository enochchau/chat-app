import { ComponentStyleConfig } from '@chakra-ui/react'
const Message: ComponentStyleConfig = {
  parts: ["message", "text"],
  baseStyle: {
    message: {
      justify:"space-between"
    },
    text: {
      paddingTop:   "4px",
      paddingBottom:"4px",
      paddingRight: "8px",
      paddingLeft:  "8px",
      borderRadius: "xl"
    }
  }
}

export const IconButton: ComponentStyleConfig = {
  baseStyle: {
    background: "none"
  },
  variants: {
    sideMsgButton:{
      color: "gray.200"
    }
  }
}