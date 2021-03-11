import * as React from 'react';
import { chakra } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faRedo, faFont } from '@fortawesome/free-solid-svg-icons';

const FAIcon = chakra(FontAwesomeIcon);
export const UserIcon = () => <FAIcon icon={faUser}/>
export const LockIcon = () => <FAIcon icon={faLock}/>
export const RedoIcon = () => <FAIcon icon={faRedo}/>
export const FontIcon = () => <FAIcon icon={faFont}/>