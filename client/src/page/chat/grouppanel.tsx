import { SidePanel } from '../../component/panel/sidepanel';
import { 
  Flex
} from '@chakra-ui/react';
import * as React from 'react';
import { GroupList, SearchBar, TitleBar } from '../../component/group';
import { GroupDataArr } from '../../api/api'

interface GroupPanelProps{
  username: string;
  avatarSrc?: string;
  moreOptionsClick: React.MouseEventHandler<HTMLButtonElement>;
  newGroupClick: React.MouseEventHandler<HTMLButtonElement>;
  groupData: GroupDataArr; // replace this later
  onSearch: React.ChangeEventHandler<HTMLInputElement>
  searchValue: string;
}


export const GroupPanel = ({
  username, 
  avatarSrc, 
  moreOptionsClick, 
  newGroupClick,
  groupData,
  onSearch,
  searchValue
}: GroupPanelProps) => {
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
      />
      <GroupList
        groupData={groupData}
      />
    </SidePanel>
  );
}