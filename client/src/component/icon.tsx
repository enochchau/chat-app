import * as React from 'react';
import { chakra, ChakraProps } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faRedo, 
  faFont, 
  faInfoCircle, 
  faSmile,
  faEllipsisV,
  faReply
} from '@fortawesome/free-solid-svg-icons';

const FAIcon = chakra(FontAwesomeIcon);
export const UserIcon = ({...rest}) => <FAIcon {...rest} icon={faUser}/>
export const LockIcon = ({...rest}) => <FAIcon {...rest} icon={faLock}/>
export const RedoIcon = ({...rest}) => <FAIcon {...rest} icon={faRedo}/>
export const FontIcon = ({...rest}) => <FAIcon {...rest} icon={faFont}/>
export const InfoIcon = ({...rest}) => <FAIcon {...rest} icon={faInfoCircle}/>
export const SmileIcon = ({...rest}) => <FAIcon {...rest} icon={faSmile}/>
export const EllipsisVIcon = ({...rest}) => <FAIcon {...rest} icon={faEllipsisV}/>
export const ReplyIcon = ({...rest}) => <FAIcon {...rest} icon={faReply}/>

