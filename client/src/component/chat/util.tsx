import { Box } from "@chakra-ui/react";
import * as React from "react";

export type NodeTypes = "[object Text]" | "[object HTMLBRElement]"

// helper function for countNodeChildren
function incrementMapValue<T>(map: Map<T, number>, key: T){
  const value = map.get(key);
  if(value){
    map.set(key, value + 1);
  } else {
    map.set(key, 1);
  }
}

// util function: count the number of child nodes as defined by childNodeTypes array
export const countNodeChildren = (childNodes: NodeListOf<ChildNode>, childNodeTypes: Array<NodeTypes>): Map<NodeTypes, number> => {
  let count: Map<NodeTypes, number> = new Map();
  childNodes.forEach((currentChild) => {
    const currentChildType = String(currentChild);

    childNodeTypes.forEach((childType) => {
      if(currentChildType === childType) incrementMapValue<NodeTypes>(count, childType);
    });

  });
  return count;
}

// util function: parse child text or br nodes to string
export const parseHtmlToString = (childNodes: NodeListOf<ChildNode>): string => {
  let outString = "";
  childNodes.forEach(child => {
    const childType = String(child) as NodeTypes;
    if (childType === "[object Text]") outString += child.textContent;
    if (childType === "[object HTMLBRElement]") outString += '\n';
  });
  // console.log(outString);
  return outString;
}

export const parseStringToHtml = (str: string): React.ReactNode => {
  const strArr = str.split('');
  return(
    <Box>
      {
        strArr.map((character, i) => {
          // add an extra space to replace the newline char
          if (character === '\n') return (<> <br/></>)
          return character
        })
      }
    </Box>
  );
}
