import { NodeTypes } from './placeholder';
import { ChatMessage, ChatTopics } from '../../../api/validators/websocket'

// util function: parse child text nodes or br nodes to string
const parseHtmlToString = (childNodes: NodeListOf<ChildNode>): string => {
  let outString = "";
  childNodes.forEach(child => {
    const childType = String(child) as NodeTypes;
    if (childType === "[object Text]") outString += child.textContent;
    if (childType === "[object HTMLBRElement]") outString += '\n';
  });
  return outString;
}

function prepareMessageForWs(topic: ChatTopics, childNodes: NodeListOf<ChildNode>, userId: number, chatId: number): ChatMessage{
  const inputText = parseHtmlToString(childNodes);
  return {
    topic: topic,
    payload:{
      timestamp: new Date(),
      message: inputText,
      chatId: chatId,
      userId: userId
    }
  } as ChatMessage
}

export function processSendMessageEvent(event: React.KeyboardEvent<HTMLDivElement>, topic: ChatTopics, userId: number, chatId: number): ChatMessage | undefined{
  if(event.currentTarget.textContent){
    const childNodes = event.currentTarget.childNodes;
    return prepareMessageForWs(topic, childNodes, userId, chatId);
  }
}