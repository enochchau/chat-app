import * as React from 'react';
import { UserData } from '../../api/validators/entity';
import {
  Flex,
  Checkbox,
} from '@chakra-ui/react';
import { ListItem } from '../listItem';

interface UserCheckListProps {
  userData: UserData[];
  onChooseUser: (_user: UserData) => void;
}
export const UserCheckList: React.FC<UserCheckListProps> = ({userData, onChooseUser}: UserCheckListProps) => {
  const [checked, setChecked] = React.useState<boolean[]>(new Array(userData.length).fill(false));

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
                isChecked={checked[i]} 
                onChange={(e): void => {
                  const copy = [...checked];
                  copy[i] = !copy[i];
                  setChecked(copy);
                  onChooseUser(user);
                }}
              />
            </Flex>
          );
        })
      }
    </Flex>
  );
}