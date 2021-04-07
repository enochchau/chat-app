import * as React from 'react';
import { UserData } from '../api/validators/entity';
import { Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';

interface UserTagsProps{
  users: UserData[];
  onRemoveClick: (_e: React.MouseEvent<HTMLButtonElement>, _user: UserData) => void;
}

export const UserTags: React.FC<UserTagsProps> = ({users, onRemoveClick}) => {
  return(
    <>
      {
        users.map((user, i) => (
          <Tag 
            size="md" 
            key={i} 
            variant="subtle" 
            colorScheme="facebook"
            ml="4px"
            mr="4px"
          >
            <TagLabel><span title={user.name}>{user.name}</span></TagLabel>
            <TagCloseButton onClick={(e): void => onRemoveClick(e, user)}/>
          </Tag>))
      }
    </>
  );
}