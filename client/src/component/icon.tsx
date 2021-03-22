import * as React from 'react';
import { chakra } from '@chakra-ui/react';
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
  faSearch,
  faEllipsisH,
  faEdit,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faSmile as farSmile } from '@fortawesome/free-regular-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const FAIcon = chakra(FontAwesomeIcon);
export const UserIcon = ({...rest}) => <FAIcon {...rest} icon={faUser}/>
export const LockIcon = ({...rest}) => <FAIcon {...rest} icon={faLock}/>
export const RedoIcon = ({...rest}) => <FAIcon {...rest} icon={faRedo}/>
export const FontIcon = ({...rest}) => <FAIcon {...rest} icon={faFont}/>
export const InfoIcon = ({...rest}) => <FAIcon {...rest} icon={faInfoCircle}/>
export const SmileIcon = ({...rest}) => <FAIcon {...rest} icon={faSmile}/>
export const EllipsisVIcon = ({...rest}) => <FAIcon {...rest} icon={faEllipsisV}/>
export const ReplyIcon  = ({...rest}) => <FAIcon {...rest} icon={faReply}/>
export const CircleIcon = ({...rest}) => <FAIcon {...rest} icon={faCircle}/>
export const SmileIconRegular = ({...rest}) => <FAIcon {...rest} icon={farSmile}/>
export const SearchIcon = ({...rest}) => <FAIcon {...rest} icon={faSearch}/>
export const EllipsisHIcon = ({...rest}) => <FAIcon {...rest} icon={faEllipsisH}/>
export const GithubIcon = ({...rest}) => <FAIcon {...rest} icon={ faGithub }/>
export const EditIcon = ({...rest}) => <FAIcon {...rest} icon={ faEdit }/>
export const ArrowLeftIcon = ({...rest}) => <FAIcon {...rest} icon={ faArrowLeft }/>

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