import express from 'express';

import { MessageEntity } from '../entity/group';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';

export class MessageRouter {
  public router = express.Router();

  constructor(){
    this.getLastMessages();
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
}