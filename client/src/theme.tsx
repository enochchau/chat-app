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
        backgroundColor: "gray.300",
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

export const Form: ComponentStyleConfig = {
  parts: ["form", "title", "altLink"],
  baseStyle: {
    form: {
      padding: "20px",
      boxShadow: "base"
    },
    title: {
      size: "lg",
    },
    altLink: {
      fontSize:"xs"
    }
  }
}

export const SidePanel: ComponentStyleConfig = {
  baseStyle: {
    maxHeight: "100vh",
    overflowY: "auto",
    borderLeft: '1px',
    borderRight: '1px',
    borderLeftColor: 'gray.200',
    borderRightColor: 'gray.200',
  },
  variants:{
    leftPanel: {
      width: {
        sm: '84px',
        md: '360px'
      },
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    rightPanel: {
      width: "320px",
    }
  }
}

export const TopPanel: ComponentStyleConfig = {
  baseStyle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    boxShadow: "base"
  },
  variants:{
    userSearch: {
      justifyContent: 'flex-start'
    },
  }
}

export const SearchBar: ComponentStyleConfig = {
  parts:['icon', 'input'],
  baseStyle:{
    input:{
      _focus:{
        outline: 'none',
      },
    },
  },
  variants: {
    groupSearch:{
      input: {
        borderRadius: '3xl',
        background: 'gray.100',
        border: 'none',
        _placeholder:{
          color: 'gray.500',
          opacity: 1,
        },
        marginBottom: '8px',
      },
      icon: {
        color: 'gray.500',
      }
    },
    userSearch: {
      input:{
        backgroundColor: 'inherit',
        border: 'none',
      },
    }
  }
}

export const ListItem: ComponentStyleConfig = {
  parts: ["container", "title", "subtitle", "avatar"],
  baseStyle: {
    container: {
      flexDirection: "row",
      _hover :{
        background: 'gray.100',
        cursor: 'pointer',
      },
      height: '72px',
      alignItems: 'center',
      justifyContent: 'space-around',
      borderRadius: 'xl',
      paddingLeft: '8px',
      paddingRight: '8px',
    },
    avatar: {
    },
    title:{
      width: '236px',
      fontSize: 'md',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    subtitle:{
      width: '236px',
      textOverflow: 'ellipsis',
      fontSize: 'sm',
      color: 'gray.500',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  },
  variants: {
    groupSearch:{},
    groupList: {},
    userSearch:{
      container: {
        height: '52px'
      }
    },
  }
}

export const TitleBar: ComponentStyleConfig = {
  parts: ["container", "title", "icon", "iconButton"],
  baseStyle: {
    container: {
      display: {sm: 'none', md: 'flex'},
      flexDir: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '16px',
      marginBottom: '16px',
      marginRight: '8px',
      marginLeft: '8px',
    },
    title: {
      fontSize:'2xl',
    },
    icon: {},
    iconButton: {},
  }
}

export const FloatingBox: ComponentStyleConfig = {
  baseStyle:{
    position: 'absolute',
    overflow: 'auto'
  },
  variants:{
    userSearchResults: {
      top: "54px",
      border: '1px',
      borderColor: 'gray.100',
      backgroundColor : 'white',
      height: "407px",
      width: "328px",
      boxShadow: "2xl",
      borderRadius: 'lg',
    }
  }
}

export const ChatInput: ComponentStyleConfig = {
  baseStyle:{
    width:"100%",
    maxHeight:"100px",
    overflowY:"auto",
    overflowX:'hidden',
  }
}
// this is the inner content of the above
export const ChatInputChild: ComponentStyleConfig = {
  baseStyle:{
    ml: "10px",
    mr: "10px",
    padding: "5px",
    overflowWrap: "break-word",
    textOverflow: "clip",
    border: "none",
    _focus: {
      outline: "none"
    },
    fontSize: "md", 
  },
  variants: {
    showPlaceholder:{
      _after:{
        content: '"Aa"',
        color: 'gray.500',
      }
    },
    noPlaceholder:{
      _after:{}
    }
  }
}