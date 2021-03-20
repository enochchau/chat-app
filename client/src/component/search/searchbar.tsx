import * as React from 'react';
import {
  Input, 
  InputGroup, 
  InputLeftElement, 
  useStyleConfig
} from '@chakra-ui/react';

interface SearchBarProps {
  placeholder: string,
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onFocus: React.FocusEventHandler<HTMLInputElement>,
  onBlur: React.FocusEventHandler<HTMLInputElement>,
  icon?: React.ReactNode,
  variant?: string,
  size?: string,
}
export const SearchBar = ({placeholder, value, onChange, onFocus, onBlur, icon, variant, size}: SearchBarProps) => {
  const [showIcon, setShowIcon] = React.useState<boolean>(true);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowIcon(false);
    onFocus(e);
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setShowIcon(true);
    onBlur(e);
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Enter"){
      e.preventDefault();
      e.currentTarget.blur();
    }
  }
  const styles = useStyleConfig("Input", {variant, size});
  return(
    <InputGroup>
      {icon && (showIcon &&
        <InputLeftElement
          pointevents="none"
          children={icon}
        />)
      }
      <Input 
        type="text" 
        onFocus={handleFocus} 
        onBlur={handleBlur}
        placeholder={placeholder}
        onKeyPress={handleKeyPress}
        onChange={onChange}
        value={value}
        sx={styles}
      />
    </InputGroup>
  );
}