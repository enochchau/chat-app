import { SidePanel } from '../../component/panel/sidepanel';
import { 
  Flex
} from '@chakra-ui/react';
import * as React from 'react';
import { GroupList, SearchBar, TitleBar } from '../../component/group';

interface LeftPanelProps {
  username: string;
  avatarSrc?: string;
  moreOptionsClick: React.MouseEventHandler<HTMLButtonElement>;
  newGroupClick: React.MouseEventHandler<HTMLButtonElement>;
  groupData: Array<any>; // replace this later
}


export const LeftPanel = ({
  username, 
  avatarSrc, 
  moreOptionsClick, 
  newGroupClick,
  groupData,
}: LeftPanelProps) => {
  return(
    <SidePanel width={{sm: '84px', md:"360px"}} boxShadow="base">
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
        placeholder={"Search Messenger"}
      />
      <GroupList
        groupData={groupData}
      />
    </SidePanel>
  );
}