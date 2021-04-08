import * as React from 'react';
import {
  Input, 
  InputGroup, 
  InputLeftElement, 
  useMultiStyleConfig, 
} from '@chakra-ui/react';

interface SearchBarProps {
  placeholder?: string,
  value: string,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onFocus?: React.FocusEventHandler<HTMLInputElement>,
  onBlur?: React.FocusEventHandler<HTMLInputElement>,
  icon?: React.ReactNode,
  variant?: string,
  size?: string,
}
export const SearchBar: React.FC<SearchBarProps> = ({placeholder, value, onChange, onFocus, onBlur, icon, variant, size}: SearchBarProps) => {
  const [showIcon, setShowIcon] = React.useState<boolean>(true);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>):void => {
    setShowIcon(false);
    if(onFocus) onFocus(e);
  }
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    setShowIcon(true);
    if(onBlur) onBlur(e);
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>):void => {
    if(e.key === "Enter"){
      e.preventDefault();
      e.currentTarget.blur();
    }
  }
  const styles = useMultiStyleConfig("SearchBar", {variant, size});
  return(
    <InputGroup>
      {icon && (showIcon &&
        <InputLeftElement
          pointevents="none"
          children={icon}
          sx={styles.icon}
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
        sx={styles.input}
      />
    </InputGroup>
  );
}