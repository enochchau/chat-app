import { Button, Text, Heading, Avatar, HStack, IconButton, Box, useStyleConfig, Flex } from '@chakra-ui/react';
import { InfoIcon } from '../../../component/icon';
import * as React from 'react';
import { TopPanel } from '../../../component/panel/toppanel';
import { SearchBar } from '../../../component/group';
import { UserSearchList } from '../../../component/search/searchList';
import { UserData } from '../../../api/validators/entity';
import { ClosableText } from '../../../component/closableText';

interface TopAvatarPanelProps {
  username: string;
  avatarSrc?: string;
  onInfoClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TopAvatarPanel: React.FC<TopAvatarPanelProps> = ({username, avatarSrc, onInfoClick}) => {
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
          size="sm"
          fontSize='xl'
          icon={<InfoIcon color='blue.400'/>}
          onClick={onInfoClick}
          background="none"
        />
      </HStack>
    </TopPanel>
  );
}

interface UserSearchPanelProps {
  searchValue: string,
  searchResults: UserData[],
  onInputChange: React.ChangeEventHandler<HTMLInputElement>,
  onResultClick: (e: React.MouseEvent<HTMLDivElement>, user: UserData) => void,
  newUserGroup: UserData[],
  onCreateClick: React.MouseEventHandler<HTMLButtonElement>,
  disableButton: boolean,
  onClickRemoveNewUser: (e: React.MouseEvent<HTMLElement>, user: UserData) => void,
}
export const UserSearchPanel: React.FC<UserSearchPanelProps> = ({
  searchValue,
  searchResults,
  onInputChange,
  onResultClick,
  newUserGroup,
  onClickRemoveNewUser,
  onCreateClick,
  disableButton
}: UserSearchPanelProps) => {
  const [hideResults, setHideResults] = React.useState(false);

  const onClickRemoveUser = (e: React.MouseEvent<HTMLElement>, user: UserData): void => {
    onClickRemoveNewUser(e, user);
  }

  return(
    <TopPanel variant='userSearch'>
      <Flex flexDir="row" align="center" width="100%" justifyContent="flex-start">
        <Text>To:</Text>
        {
          newUserGroup.map((user, i) => 
            <ClosableText key={i} onXClick={(e): void => onClickRemoveUser(e, user)}>{user.name}</ClosableText>
          )
        }
        <SearchBar
          value={searchValue}
          onChange={onInputChange}
          variant="userSearch"
          onFocus={(e) => setHideResults(false)}
          onBlur={(e) => {
            setTimeout(() => {
              setHideResults(true);
            }, 200);
          }}
        />
      </Flex>
      <Button onClick={onCreateClick} disabled={disableButton}>Create</Button>
      { !hideResults && 
        <FloatingSearchResults searchResults={searchResults} onResultClick={onResultClick}/>
      }
    </TopPanel>
  );
}


interface FloatingSearchResultsProps{
  searchResults: UserData[];
  onResultClick: (e: React.MouseEvent<HTMLDivElement>, user: UserData) => void;
}
const FloatingSearchResults: React.FC<FloatingSearchResultsProps> = ({
  searchResults, onResultClick
}: FloatingSearchResultsProps) => {
  const styles = useStyleConfig("FloatingBox", {variant: 'userSearchResults'})
  return(
    <Box sx={styles}>
      <UserSearchList
        searchResults={searchResults}
        onClick={onResultClick}
      />
    </Box>
  );
}