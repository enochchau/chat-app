import { ComponentStyleConfig } from '@chakra-ui/react'
export const Message: ComponentStyleConfig = {
  parts: ["message", "text", "sideButtons"],
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
    },
  },
  variants: {
    left: {
      message: {
        flexDirection: "row"
      },
      sideButtons: {
        flexDir: "row"
      }
    },
    right: {
      message: {
        flexDir: "row-reverse"
      },
      sideButtons: {
        flexDir: "row-reverse"
      }
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