import { Button, 
  Text, 
  Heading, 
  Avatar, 
  HStack, 
  IconButton, 
  Box, 
  useStyleConfig, 
  Tag, 
  TagLabel, 
  TagCloseButton,
  Spinner,
  Center
} from '@chakra-ui/react';
import { InfoIcon } from '../../../component/icon';
import * as React from 'react';
import { TopPanel } from '../../../component/panel/toppanel';
import { SearchBar } from '../../../component/group';
import { UserSearchList } from '../../../component/search/searchList';
import { UserData } from '../../../api/validators/entity';
import { trimGroupName } from '../../../util/trimName';
import { StoreContext } from '../../../store';

interface TopAvatarPanelProps {
  username: string;
  avatarSrc?: string;
  onInfoClick: React.MouseEventHandler<HTMLButtonElement>;
}
export const TopAvatarPanel: React.FC<TopAvatarPanelProps> = ({username, avatarSrc, onInfoClick}) => {
  const {storeState} = React.useContext(StoreContext);
  return(
    <TopPanel>
      <HStack padding="5px">
        <Avatar name={username} src={avatarSrc} size="sm"/>
        <Heading size="sm">
          {trimGroupName(username, storeState.name)}
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
  onResultClick: (_e: React.MouseEvent<HTMLDivElement>, _user: UserData) => void,
  newUserGroup: UserData[],
  onCreateClick: React.MouseEventHandler<HTMLButtonElement>,
  disableButton: boolean,
  onClickRemoveNewUser: (_e: React.MouseEvent<HTMLElement>, _user: UserData) => void,
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
      <Text>To:</Text>
      {
        newUserGroup.map((user, i) => (
          <Tag 
            size="md" 
            key={i} 
            variant="subtle" 
            colorScheme="facebook"
            ml="4px"
            mr="4px"
          >
            <TagLabel><span title={user.name}>{user.name}</span></TagLabel>
            <TagCloseButton onClick={(e): void => onClickRemoveUser(e, user)}/>
          </Tag>
        ))
      }
      <SearchBar
        value={searchValue}
        onChange={onInputChange}
        variant="userSearch"
        onFocus={(_e): void => setHideResults(false)}
        onBlur={(_e): void => {
          setTimeout(() => {
            setHideResults(true);
          }, 200);
        }}
      />
      <Button onClick={onCreateClick} disabled={disableButton}>Create</Button>
      { !hideResults && 
        <FloatingSearchResults searchResults={searchResults} onResultClick={onResultClick}/>
      }
    </TopPanel>
  );
}


interface FloatingSearchResultsProps{
  searchResults: UserData[];
  onResultClick: (_e: React.MouseEvent<HTMLDivElement>, _user: UserData) => void;
}
const FloatingSearchResults: React.FC<FloatingSearchResultsProps> = ({
  searchResults, onResultClick
}: FloatingSearchResultsProps) => {
  const styles = useStyleConfig("FloatingBox", {variant: 'userSearchResults'})
  return(
    <Box sx={styles}>
      { searchResults.length > 0 
        ?
        <UserSearchList
          searchResults={searchResults}
          onClick={onResultClick}
        />
        :
        <Center marginTop='200px'>
          <Spinner size="md" speed="0.75s"/>
        </Center>
      }
    </Box>
  );
}