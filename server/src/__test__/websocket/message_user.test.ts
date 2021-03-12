import { UserMessage } from '../../websocket/message/user';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

describe('Test UserMessage IO', () => {

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
    const onRight = (message: UserMessage): boolean => true;
    const res = pipe(UserMessage.decode(demoMessage), fold(onLeft, onRight));

    expect(res).toBe(true);
  })
})