import * as React from "react";
import { Box } from '@chakra-ui/react';


function useOutsideAlerter(ref:any, callback: () => void){
  React.useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

interface ClickOutsideProps {
  children: React.ReactNode;
  onClick: () => void;
}
export function ClickOutside({children, onClick, ...rest}: ClickOutsideProps) {
  const wrapperRef = React.useRef(null);
  useOutsideAlerter(wrapperRef, onClick);

  return <Box ref={wrapperRef}>{children}</Box>;
}