import { Text, Heading, Avatar, HStack, IconButton, Box } from '@chakra-ui/react';
import { InfoIcon } from '../../component/icon';
import * as React from 'react';
import { TopPanel } from '../../component/panel/toppanel';
import { SearchBar } from '../../component/group';
import { UserSearchList } from '../../component/search/userList';
import { UserDataArr, UserData } from '../../api/validators/entity';

interface TopAvatarPanelProps {
  username: string;
  avatarSrc?: string;
  onInfoClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TopAvatarPanel = ({username, avatarSrc, onInfoClick}: TopAvatarPanelProps) => {
  return(
    <TopPanel>
      <HStack padding="5px">
        <Avatar name={username} src={avatarSrc} size="sm"/>
        <Heading size="sm">
          {username}
        </Heading>
      </HStack>
      <HStack padding="5px">
        <IconButton
          aria-label="See Chat Info"
          isRound
          icon={<InfoIcon fontSize="lg"/>}
          onClick={onInfoClick}
          background="none"
        />
      </HStack>
    </TopPanel>
  );
}

interface UserSearchPanelProps {
  searchValue: string,
  searchResults: UserDataArr,
  onInputChange: React.ChangeEventHandler<HTMLInputElement>,
  onResultClick: (e: React.MouseEvent<HTMLDivElement>, user: UserData) => void,
  newUserGroup: UserDataArr,
}
export const UserSearchPanel = ({
  searchValue,
  searchResults,
  onInputChange,
  onResultClick,
  newUserGroup,
}: UserSearchPanelProps) => {
  const [hideResults, setHideResults] = React.useState(false);
  return(
    <TopPanel variant='userSearch'
      onFocus={(e) => setHideResults(false)}
      onBlur={(e) => {
        setTimeout(() => {
          setHideResults(true);
        }, 100);
      }}
    >
      <Text>To:</Text>
      {
        newUserGroup.map((user, i) => 
          <Text key={i}>{user.name}</Text>
        )
      }
      <SearchBar
        value={searchValue}
        onChange={onInputChange}
        variant="userSearch"
      />
      { !hideResults && 
        <Box
          position="absolute"
          top="64px"
          height="407px"
          width="328px"
          boxShadow="xl"
        >
          <UserSearchList
            searchResults={searchResults}
            onClick={onResultClick}
          />
        </Box>
      }
    </TopPanel>
  );
}