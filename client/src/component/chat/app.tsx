import { Box } from '@chakra-ui/react';
import * as React from 'react';
import { ChatInput } from './input';
import { MessageList, WsMsg } from './list';
import { StoreContext } from '../../store';
import { NodeTypes, countNodeChildren, parseHtmlToString } from './util';

// DEMO DATA
const DEMOAVATAR = "https://scontent.fsjc1-3.fna.fbcdn.net/v/t1.0-1/c24.33.198.198a/p240x240/67663361_2399631803645638_9161317739476811776_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=7206a8&_nc_ohc=cfz9q50SoxoAX8lpemZ&_nc_ht=scontent.fsjc1-3.fna&tp=27&oh=0fccda4857990efe2fd7a8595cd3e12c&oe=606CB318"

const demoMessage:WsMsg = {
  message: "some message",
  userId: 3489053908445,
  timestamp: new Date(),
  name: "person name person",
  avatar: DEMOAVATAR,
}


export const ChatApp = () => {
  const [inputText, setInputText] = React.useState<string>("");
  const [messages, setMessages] = React.useState<Array<WsMsg>>([]);
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true);

  const { storeState, storeDispatch} = React.useContext(StoreContext);

  const handleNewMessage = (newMessage: WsMsg) => {
    const updatedMessages = [...messages];
    updatedMessages.push(newMessage);
    setMessages(updatedMessages);
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const childNodes = e.currentTarget.childNodes;
    // console.log(childNodes, childNodes.length);
    const childCount = countNodeChildren(childNodes, ["[object HTMLBRElement]", "[object Text]"]);
    let brCount = childCount.get("[object HTMLBRElement]");
    if(!brCount) brCount = 0;
    // console.log("text count", textCount);
    // console.log('br count', brCount);

    // there is nothing
    if(childNodes.length === 0) setShowPlaceholder(true);
    // there is 1 non-visible br and no text content
    else if(brCount === 1 && e.currentTarget.textContent === ""){
      e.currentTarget.textContent = '';
      setShowPlaceholder(true);
    }
    // there is a visible br and no text content
    else if(brCount > 1 && e.currentTarget.textContent === ""){
      setShowPlaceholder(false);
    } 
    // there is text content
    else {
      setShowPlaceholder(false);
      if(e.currentTarget.textContent){
        setInputText(parseHtmlToString(childNodes));
      }
    }
  }

  // send message here essentially
  const sendMessage = (e:React.KeyboardEvent<HTMLDivElement>) => {
    if(e.key === "Enter" && e.shiftKey){
      e.key = "Enter";
    }
    else if(e.key === 'Enter'){
      e.preventDefault();
      // reset the chat box
      e.currentTarget.textContent = "";
      setShowPlaceholder(true);
      setInputText("");

      // send off a new message

      // THIS IS A DEMO FUNCTION, REMOVE THIS LATER
      if(inputText === "") return handleNewMessage(demoMessage);

      const newMessage: WsMsg = {
        message: inputText,
        userId: storeState.id,
        timestamp: new Date(),
        name: storeState.name,
        // avatar: storeState.avatar,
      }

      handleNewMessage(newMessage);
    }
  }
  return(
    <Box>
      <MessageList
        messages={messages}
        currentUserId={storeState.id}
      />
      <ChatInput
        text={inputText}
        showPlaceholder={showPlaceholder}
        onInput={handleInput}
        onKeyPress={sendMessage}
      />
    </Box>
  );
}

