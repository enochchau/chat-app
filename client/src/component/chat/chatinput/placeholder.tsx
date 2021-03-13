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
const countNodeChildren = (childNodes: NodeListOf<ChildNode>, childNodeTypes: Array<NodeTypes>): Map<NodeTypes, number> => {
  let count: Map<NodeTypes, number> = new Map();
  childNodes.forEach((currentChild) => {
    const currentChildType = String(currentChild);

    childNodeTypes.forEach((childType) => {
      if(currentChildType === childType) incrementMapValue<NodeTypes>(count, childType);
    });

  });
  return count;
}

// logic to determine if the placeholder should be shown
export function shouldShowPlaceholder(refCurrent: HTMLDivElement):boolean{
  if(!refCurrent) return false;
  const childNodes = refCurrent.childNodes;

  // there is nothing
  if(childNodes.length === 0) return true;

  // count the number of HTML BR Elements
  const childCount = countNodeChildren(childNodes, ["[object HTMLBRElement]"]);
  let brCount = childCount.get("[object HTMLBRElement]");
  if(!brCount) brCount = 0;

  // there is 1 non-visible br and no text content
  if(brCount === 1 && refCurrent.textContent === ""){
    refCurrent.textContent = '';
    return true;
  }
  // there is a visible br and no text content
  if(brCount > 1 && refCurrent.textContent === ""){
    return false;
  } 

  // there is text content
  return false;
}