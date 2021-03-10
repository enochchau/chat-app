import * as React from 'react';

interface InputBoxProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>,
  onChange: React.FormEventHandler<HTMLInputElement>,
  value: string
}

const InputBox = ({onSubmit, onChange, value}: InputBoxProps) => {
  return(
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        placeholder="Enter a message..." 
        value={value}
        onChange={onChange}
      />
      <input type="submit" value="send"/>
    </form>
  );
}

export default InputBox;