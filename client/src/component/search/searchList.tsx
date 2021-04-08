import { Flex } from '@chakra-ui/react';
import { UserData, GroupData} from 'api/validators/entity';
import * as React from 'react';
import { ListItem } from '../listItem';

type SearchItem = {
  name: string,
  avatar: string | null,
}
interface SearchListProps<T extends SearchItem>{
  searchResults: T[];
  variant: string;
  onClick?: (_e: React.MouseEvent<HTMLDivElement>, _item: T) => void;
}
const SearchList = <T extends SearchItem> ({searchResults, onClick, variant}: SearchListProps<T>): JSX.Element => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item: T, i: number) => 
          <ListItem
            key={i}
            title={item.name}
            avatarSrc={item.avatar}
            onClick={(e):void => {if(onClick) onClick(e, item)}}
            avatarSize="sm"
            variant={variant}
          />
        )
      }
    </Flex>
  );
}

interface UserSearchListProps{
  searchResults: Array<UserData>,
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _item: UserData) => void,
}
export const UserSearchList = ({searchResults, onClick}: UserSearchListProps) => SearchList<UserData>({searchResults: searchResults, onClick:onClick, variant:'userSearch'});

interface GroupSearchListProps{
  searchResults: Array<GroupData>,
  onClick: (_e: React.MouseEvent<HTMLDivElement>, _item: GroupData) => void,
}
export const GroupSearchList = ({searchResults, onClick}: GroupSearchListProps) => SearchList<GroupData>({searchResults: searchResults, onClick:onClick, variant:'groupSearch'});
// export const UserSearchList = ({searchResults, onClick}: UserSearchListProps) => {
//   return(
//     <Flex
//       flexDir="column"
//     >
//       {
//         searchResults.map((item: UserData, i: number) => 
//           <ListItem
//             key={i}
//             title={item.name}
//             avatarSrc={item.avatar}
//             onClick={(e) => {onClick(e, item)}}
//             avatarSize="sm"
//             variant="userSearch"
//           />
//         )
//       }
//     </Flex>

//   );
// }

// export const GroupSearchList = ({searchResults, onClick}: GroupSearchListProps) => {
//   return(
//     <Flex
//       flexDir="column"
//     >
//       {
//         searchResults.map((item: GroupData, i: number) => 
//           <ListItem
//             key={i}
//             title={item.name} 
//             onClick={(e): void => {onClick(e, item)}}
//             variant="groupList"
//           />
//         )
//       }
//     </Flex>

//   );
// }