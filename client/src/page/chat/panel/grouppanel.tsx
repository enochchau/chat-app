import { SidePanel } from '../../../component/panel/sidepanel';
import { 
  Center,
  Flex, Spinner
} from '@chakra-ui/react';
import * as React from 'react';
import { GroupList, SearchBar, TitleBar } from '../../../component/group';
import { GroupMessageData, GroupData } from '../../../api/validators/entity'
import { GroupSearchList } from '../../../component/search/searchList';
import { ArrowLeftIcon, SearchIcon } from '../../../component/icon';

interface GroupPanelProps{
  username: string;
  avatarSrc?: string;
  moreOptionsClick: React.MouseEventHandler<HTMLButtonElement>;
  newGroupClick: React.MouseEventHandler<HTMLButtonElement>;
  groupData: GroupMessageData[]; 
  onSearch: React.ChangeEventHandler<HTMLInputElement>;
  searchValue: string;
  searchResults: Array<GroupData>;
  onSearchResultClick: (_e: React.MouseEvent<HTMLDivElement>, _item: GroupData) => void;
  onGroupClick: (_e: React.MouseEvent<HTMLDivElement>, _id: number) => void;
}


export const GroupPanel: React.FC<GroupPanelProps> = ({
  username, 
  avatarSrc, 
  moreOptionsClick, 
  newGroupClick,
  groupData,
  onSearch,
  searchValue,
  searchResults,
  onSearchResultClick,
  onGroupClick
}: GroupPanelProps) => {
  const [showSearch, setShowSearch] = React.useState(false);
  return(
    <SidePanel variant="leftPanel">
      <TitleBar
        title="Chats"
        username={username}
        avatarSrc={avatarSrc}
        onGithubClick={(_e):void => {window.location.href="https://github.com/ec965/chat-app"}}
        onEllipsisClick={moreOptionsClick}
        onEditClick={newGroupClick}
      />
      <Flex
        flexDir="row"
        align="center"
      >
        { showSearch && 
          <ArrowLeftIcon
            marginBottom="8px"
            marginLeft="6px"
            marginRight="14px"
            cursor="pointer"
          /> 
        }
        <SearchBar
          onChange={onSearch}
          value={searchValue}
          placeholder={"Search Messenger"}
          onFocus={(_e): void => setShowSearch(true)}
          onBlur={(_e):void => {
            setTimeout(() => {
              setShowSearch(false);
            }, 100);
          }}
          icon={<SearchIcon/>}
          variant="groupSearch"
        />
      </Flex>
      {showSearch 
        ?
        searchResults.length > 0 
          ?
          <GroupSearchList
            searchResults={searchResults}
            onClick={onSearchResultClick}
          />
          :
          <Center marginTop="40vh" marginBottom="30vh">
            <Spinner size="md" speed="0.75s"/>
          </Center>
        :
        <GroupList
          onClick={onGroupClick}
          groupData={groupData}
        />
      }
    </SidePanel>
  );
}