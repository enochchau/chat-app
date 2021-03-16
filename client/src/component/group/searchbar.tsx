import * as React from 'react';
import {
  chakra,
  Input, 
  InputGroup, 
  InputLeftElement 
} from '@chakra-ui/react';
import { SearchIcon } from '../icon';

interface SearchBarProps {
  placeholder: string,
}
export const SearchBar = ({placeholder}: SearchBarProps) => {
  const [showIcon, setShowIcon] = React.useState<boolean>(true);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowIcon(false);
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowIcon(true);
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      e.preventDefault();
      e.currentTarget.blur();
    }
  }

  return(
    <InputGroup>
      {showIcon &&
        <InputLeftElement
          pointEvents="none"
          children={<SearchIcon/>}
        />
      }
      <Input 
        type="text" 
        onFocus={handleFocus} 
        onBlur={handleBlur}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
      />
    </InputGroup>
  );
}