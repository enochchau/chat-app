import { SidePanel } from '../../component/panel/sidepanel';
import { 
  Flex
} from '@chakra-ui/react';
import * as React from 'react';
import { GroupList, SearchBar, TitleBar } from '../../component/group';
import { GroupData, GroupMessageDataArr } from '../../api/validators/entity'
import { GroupSearchList } from '../../component/search/searchList';
import { SearchIcon } from '../../component/icon';

interface GroupPanelProps{
  username: string;
  avatarSrc?: string;
  moreOptionsClick: React.MouseEventHandler<HTMLButtonElement>;
  newGroupClick: React.MouseEventHandler<HTMLButtonElement>;
  groupData: GroupMessageDataArr; // replace this later
  onSearch: React.ChangeEventHandler<HTMLInputElement>;
  searchValue: string;
  searchResults: Array<GroupData>;
  onSearchResultClick: (e: React.MouseEvent<HTMLDivElement>, item: GroupData) => void;
  onGroupClick: (e: React.MouseEvent<HTMLDivElement>, id: number) => void;
}


export const GroupPanel = ({
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
      <Flex
        flexDir="row"
      >
      </Flex>
      <TitleBar
        title="Chat"
        username={username}
        avatarSrc={avatarSrc}
        onGithubClick={(e) => window.location.href="https://github.com/ec965/chat-app"}
        onEllipsisClick={moreOptionsClick}
        onEditClick={newGroupClick}
      />
      <SearchBar
        onChange={onSearch}
        value={searchValue}
        placeholder={"Search Messenger"}
        onFocus={(e) => setShowSearch(true)}
        onBlur={(e) => setShowSearch(false)}
        icon={<SearchIcon/>}
        variant="groupSearch"
      />
      {showSearch 
       ?<GroupSearchList
            searchResults={searchResults}
            onClick={onSearchResultClick}
          />
       :<GroupList
          onClick={onGroupClick}
          groupData={groupData}
        />
      }
    </SidePanel>
  );
}