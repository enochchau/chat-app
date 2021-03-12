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
  faReply,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faSmile as farSmile } from '@fortawesome/free-regular-svg-icons';

const FAIcon = chakra(FontAwesomeIcon);
export const UserIcon = ({...rest}) => <FAIcon {...rest} icon={faUser}/>
export const LockIcon = ({...rest}) => <FAIcon {...rest} icon={faLock}/>
export const RedoIcon = ({...rest}) => <FAIcon {...rest} icon={faRedo}/>
export const FontIcon = ({...rest}) => <FAIcon {...rest} icon={faFont}/>
export const InfoIcon = ({...rest}) => <FAIcon {...rest} icon={faInfoCircle}/>
export const SmileIcon = ({...rest}) => <FAIcon {...rest} icon={faSmile}/>
export const EllipsisVIcon = ({...rest}) => <FAIcon {...rest} icon={faEllipsisV}/>
export const ReplyIcon = ({...rest}) => <FAIcon {...rest} icon={faReply}/>
export const CircleIcon = ({...rest}) => <FAIcon {...rest} icon={faCircle}/>
export const SmileIconRegular = ({...rest}) => <FAIcon {...rest} icon={farSmile}/>

interface StackedIconProps {
  top: React.ReactNode,
  bottom: React.ReactNode,
}
export const StackedIcon = ({top, bottom, ...rest}:StackedIconProps) => {
  return(
    <span className="fa-stack fa-2x">
      {bottom}
      {top}
    </span>
  );
}