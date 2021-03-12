import { ChatMessage } from '../../../websocket/message';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

describe('Test ChatMessage IO', () => {

  const demoMessage = {
    topic: 'join group',
    payload: {
      timestamp: new Date(), 
      message: "demo message",
      chatId: 1 
    }
  }

  test('Validate an Okay message', () => {

    const onLeft = (errors: t.Errors):boolean => false;
    const onRight = (message: ChatMessage): boolean => true;
    const res = pipe(ChatMessage.decode(demoMessage), fold(onLeft, onRight));

    expect(res).toBe(true);
  })
})