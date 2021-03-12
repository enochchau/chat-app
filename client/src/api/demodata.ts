import { DisplayableMessage } from 'component/chat/messagelist';
import { ChatMessage, ServerMessage } from './validators/websocket';

export const rxFriendMessage: ChatMessage ={
  topic: "chat friend",
  payload: {
    chatId: 33,
    timestamp: new Date(),
    message: "Some chat message here.",
    userId: 2,
  }
}

export const rxGroupMessage: ChatMessage = {
  topic: 'chat group',
  payload: {
    chatId: 33,
    timestamp: new Date(),
    message: "some group chat message",
    userId: 2,
  }
}

export const demoDisplayMessage: DisplayableMessage = {
  userId: 2,
  timestamp: new Date(),
  name: "Hi Me 5Cents",
  message: "Hello there ",
}