import { ComponentStyleConfig } from '@chakra-ui/react'
export const Message: ComponentStyleConfig = {
  parts: ["message", "text", "sideButtons"],
  baseStyle: {
    message: {
      justify:"space-between",
      pt: "2px",
    },
    text: {
      pt:"4px",
      pb:"4px",
      pr:"8px",
      pl:"8px",
      borderRadius: "xl"
    },
    sideButtons:{
      justify:"center",
      align:"center",
      mt:"2px"
    }
  },
  variants: {
    left: {
      message: {
        flexDirection: "row"
      },
      text: {
        backgroundColor: "gray.400",
        color: "black"
      },
      sideButtons: {
        flexDir: "row"
      }
    },
    right: {
      message: {
        flexDir: "row-reverse"
      },
      text: {
        backgroundColor: "blue.400",
        color: "white"
      },
      sideButtons: {
        flexDir: "row-reverse"
      }
    }
  }
}

export const Icon: ComponentStyleConfig = {
  baseStyle: {
    background: "none",
    margin: "5px",
  },
  variants: {
    sideMsgButton:{
      color: "gray.300"
    }
  }
}