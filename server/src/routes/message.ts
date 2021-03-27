import express from 'express';
import { MessageEntity } from '../entity/message';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

export class MessageRouter {
  public router = express.Router();

  constructor(){
    this.getLastMessages();
    this.removeMessage();
  }

  private getLastMessages() {
    const ReqType = t.type({
      groupIds: t.array(t.number)
    });
    type ReqType = t.TypeOf<typeof ReqType>;
    this.router.post('/last', (req,res,next) => {
      const onLeft = async (errors: t.Errors) => { res.status(400).json(errors) };
      const onRight = async (body: ReqType) => {
        const messages = await MessageEntity.findLastMessageOfGroupIds(body.groupIds);

        res.json(messages);
      }

      pipe(ReqType.decode(req.body), fold(onLeft, onRight));
    })
  }

  private removeMessage() {
    const Req = t.type({
      messageId: t.number
    });
    type ReqType = t.TypeOf<typeof Req>;

    this.router.patch('/', (req,res,next)  => {
      const onLeft = async (errors: t.Errors): Promise<void> => { res.sendStatus(400)}
      
      const onRight = async (body: ReqType): Promise<void> => {
        try{
          let message = await MessageEntity.findOne(body.messageId);

          if(message && req.user && req.user.id === message.userId) {
            message.message = "This message was unsent."
            
            const updatedMessage = await MessageEntity.save(message);

            res.json(updatedMessage);
          } else res.sendStatus(400);
        } catch( error ) {
          next(error);
        }
      }

      pipe(Req.decode(req.body), fold(onLeft, onRight));
    })
  }
}