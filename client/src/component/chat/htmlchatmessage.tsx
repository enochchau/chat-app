import * as React from 'react';

export const parseStringToHtml = (str: string): React.ReactFragment => {
  const strArr = str.trim().split('\n');
  return(
    <>
      {
        strArr.map((peice, i) => {
          if(i !== strArr.length - 1) return <React.Fragment key={i}>{peice}<br/></React.Fragment>;
          return <React.Fragment key={i}>{peice}</React.Fragment>;
        })
      }
    </>
  );
}