import { ComponentStyleConfig } from '@chakra-ui/react'

export const PanelFrame: ComponentStyleConfig = {
  variants:{
    sidePanel: {
      height:"100vh",
      borderLeft:'1px',
      borderRight:'1px',
      borderLeftColor:'gray.200',
      borderRightColor:'gray.200',
    },
    centerPanel: {
      width:'100%',
      flexDir:"column",
      justify:"space-between",
      height:"100vh",
      display: "flex",
    },
    messagePanel:{
      overflowY:"auto",
      padding:"5px",
      flexBasis:"calc( 100vh - 54px - 70px )", // 54=bottom, 74=top 
    },
    screen:{
      height:"100vh",
      width:"100vw",
      // overflowX="hidden"
      // overflowY="hidden"
      direction:"row",
      wrap:"nowrap",
      justify:"space-between",
      align:"flex-start",
      display:'flex',
    }
  }
}

export const Message: ComponentStyleConfig = {
  parts: ["message", "text", "sideButtons", "name"],
  baseStyle: {
    message: {
      paddingTop: "2px",
      justifyContent: 'flex-start',
    },
    text: {
      pt:"4px",
      pb:"4px",
      pr:"10px",
      pl:"10px",
      borderRadius: '3xl',
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
    },
    name: {
      fontSize: "xs",
      color: "gray.500",
      marginLeft: '44px',
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
    },
    removedLeft: {
      message: {
        flexDir: 'row'
      },
      text: {
        backgroundColor: "white",
        color: "gray.400",
        border: '1px',
        borderColor: 'gray.400',
      },
      sideButtons: {
        display: 'none'
      }
    },
    removedRight: {
      message: {
        flexDir: "row-reverse"
      },
      text: {
        backgroundColor: "white",
        color: "gray.400",
        border: '1px',
        borderColor: 'gray.400',
      },
      sideButtons: {
        display: 'none'
      }
    },
  },
  sizes: {
    middleLeft: {
      text: {
        borderTopLeftRadius: 'md',
        borderBottomLeftRadius: 'md',
      },
    },
    topLeft: {
      text: {
        borderBottomLeftRadius: 'md',
      },
    },
    bottomLeft: {
      text: {
        borderTopLeftRadius: 'md',
      }
    },
    middleRight: {
      text: {
        borderTopRightRadius: 'md',
        borderBottomRightRadius: 'md',
      },
    },
    topRight: {
      text: {
        borderBottomRightRadius: 'md',
      },
    },
    bottomRight: {
      text: {
        borderTopRightRadius: 'md',
      }
    }
  }
}

export const Icon: ComponentStyleConfig = {
  baseStyle: {
    background: "none",
  },
  variants: {
    clickable:{
      cursor: 'pointer',
    },
    emojiPicker: {
      color: "blue.400",
      padding: '0',
      margin: '0',
    },
    sideMsgButton:{
      fontSize: '16px',
      marginLeft: '1px',
      marginRight: '1px',
    }
  },
  sizes: {
    smallText: {
      cursor: 'pointer',
    },
  },
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
      justifyContent: 'space-between',
      alignItems: 'center',
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
        paddingTop: '2px',
        paddingBottom: '2px',
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
    groupList: {
      title:{
        display: {sm: 'none', md: 'block'}
      },
      subtitle: {
        display: {sm: 'none', md: 'block'}
      },
    },
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

export const AlertDialog: ComponentStyleConfig = {
  parts: ['header, closeButton'],
  variants: {
    removeMessage: {
      header: {
        fontSize: 'lg',
        fontWeight: 'bold',
        borderBottom: '1px',
        borderColor: 'gray.100',
      },
      closeButton: {
        borderRadius: '3xl',
        color: 'gray.500',
        backgroundColor: 'gray.50'
      }
    }
  }
}

export const Button: ComponentStyleConfig = {
  variants:{
    cancel: {
      fontSize: 'sm',
      paddingLeft: '12px',
      paddingRight: '12px',
      color: 'blue.400',
      backgroundColor: 'white',
      margin: '4px',
      _hover:{
        background: 'gray.100',
      },
    },
    okay: {
      fontSize: 'sm',
      paddingLeft: '12px',
      paddingRight: '12px',
      color: 'white',
      backgroundColor: 'blue.400',
      _hover:{
        background: 'blue.500',
      },
      margin: '4px',
    }
  }
} 

export const Spinner: ComponentStyleConfig = {
  baseStyle: {
    color: "gray.400"
  }
}