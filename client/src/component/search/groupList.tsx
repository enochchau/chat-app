import { Flex } from '@chakra-ui/react';
import { GroupDataArr } from 'api/validators/entity';
import * as React from 'react';
import { SearchResult } from './result';
import { Redirect } from 'react-router-dom';

interface SearchListProps {
  searchResults: GroupDataArr 
}
export const SearchList = ({searchResults}: SearchListProps) => {
  return(
    <Flex
      flexDir="column"
    >
      {
        searchResults.map((item, i) => 
          <SearchResult
            key={i}
            title={item.name}
            onClick={(e) => <Redirect to={`/chat/${item.id}`}/>}
          />
        )
      }
    </Flex>

  );
}
