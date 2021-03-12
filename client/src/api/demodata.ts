import { ChatMessage, ServerMessage } from './validators/websocket';

export const rxFriendMessage: ChatMessage ={
  topic: "chat friend",
  payload: {
    chatId: 33,
    timestamp: new Date(),
    message: "Some chat message here."
  }
}

export const rxGroupMessage: ChatMessage = {
  topic: 'chat group',
  payload: {
    chatId: 33,
    timestamp: new Date(),
    message: "some group chat message"
  }
}