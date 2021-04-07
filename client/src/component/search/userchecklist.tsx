import * as React from 'react';
import { UserData } from '../../api/validators/entity';
import {
  Flex,
  Checkbox,
} from '@chakra-ui/react';
import { ListItem } from '../listItem';

interface UserCheckListProps {
  userData: UserData[];
  chosenUsers: UserData[];
  onChooseUser: (_user: UserData) => void;
}
export const UserCheckList: React.FC<UserCheckListProps> = ({userData, chosenUsers, onChooseUser}: UserCheckListProps) => {
  const chosenUserIds = chosenUsers.reduce((acc, user) => {
    acc.add(user.id);
    return acc;
  }, new Set() as Set<number>)

  return(
    <Flex
      flexDir="column"
    >
      {
        userData.map((user, i) => {
          return(
            <Flex flexDir="row" justifyContent='space-between' key={user.id}>
              <ListItem
                title={user.name}
                avatarSrc={user.avatar}
                avatarSize="sm"
                variant="userSearch"
              />
              <Checkbox 
                isChecked={chosenUserIds.has(user.id)} 
                onChange={(_e): void => {onChooseUser(user);}}
              />
            </Flex>
          );
        })
      }
    </Flex>
  );
}