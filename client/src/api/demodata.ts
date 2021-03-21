import { DisplayableMessage } from 'component/chat/messagelist';
import { RxChatMessage } from './validators/websocket';

export const RxDemoMessage: RxChatMessage = {
  topic: "chat",
  payload: {
    timestamp: new Date(),
    message: "Some chat message here.",
    groupId: 33,
    userId: 2,
    id: 2,
    created: new Date(),
    updated: new Date(),
  }
}

export const DisplayDemoMessage: DisplayableMessage = {
  userId: 1,
  name: "Bobby user",
  message: "Hello there fellow human.",
  timestamp: new Date(),
}