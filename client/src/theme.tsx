import { ComponentStyleConfig } from '@chakra-ui/react'
export const Message: ComponentStyleConfig = {
  parts: ["message", "text", "sideButtons"],
  baseStyle: {
    message: {
      alignItems:"center",
      paddingTop: "2px",
    },
    text: {
      pt:"4px",
      pb:"4px",
      pr:"8px",
      pl:"8px",
      borderRadius: "xl"
    },
    sideButtons:{
      display: "flex",
      justifyContent:"center",
      alignItems:"stretch",
      mt:"2px",
      color: "transparent",
      _hover: {
        color: "gray.300"
      }
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
    }
  }
}

export const Tooltip: ComponentStyleConfig = {
  baseStyle: {
    fontSize: "sm",
    borderRadius: "lg",
    padding: "5px",
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  variants: {
    sideMsgButton: {
    }
  }
}