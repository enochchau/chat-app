import { StringWsMsg } from '../wsmsg';
import { NodeTypes } from './placeholder';

// util function: parse child text nodes or br nodes to string
const parseHtmlToString = (childNodes: NodeListOf<ChildNode>): string => {
  let outString = "";
  childNodes.forEach(child => {
    const childType = String(child) as NodeTypes;
    if (childType === "[object Text]") outString += child.textContent;
    if (childType === "[object HTMLBRElement]") outString += '\n';
  });
  // console.log(outString);
  return outString;
}

function prepareMessageForWs(childNodes: NodeListOf<ChildNode>, userId: number, name: string, avatar?: string){
  const inputText = parseHtmlToString(childNodes);
  const newMessage: StringWsMsg = {
    message: inputText,
    userId: userId,
    timestamp: new Date(),
    name: name,
    avatar: avatar,
  };
  return newMessage;
}

export function processSendMessageEvent(event: React.KeyboardEvent<HTMLDivElement>, userId: number, name: string, avatar?:string): StringWsMsg | undefined{
  if(event.key === "Enter" && event.shiftKey) event.key = "Enter";

  else if(event.key === "Enter"){
    event.preventDefault();
    if(event.currentTarget.textContent){
      const childNodes = event.currentTarget.childNodes;
      return prepareMessageForWs(childNodes, userId, name, avatar);
    }
  }
}