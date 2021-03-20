import express from 'express';
import { UserEntity } from '../entity/user';
import { GroupEntity } from '../entity/group';

import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

export class SearchRouter {
  public router = express.Router();

  constructor(){
    this.getSearchGroups();
    this.getSearchUsers();
  }

  private getSearchGroups(){
    const ManyQuery = t.type({
      count: tt.NumberFromString,
      search: t.string,
    });
    type ManyQuery = t.TypeOf<typeof ManyQuery>;

    this.router.get('/group', (req, res, next) => {
      const onLeft = async (errors: t.Errors) => { res.status(400).json(errors) };

      const onRight = async (query: ManyQuery) => {
        const groups = await GroupEntity.searchGroupByName(query.search, query.count);

        res.json(groups);
      }

      pipe(ManyQuery.decode(req.query), fold(onLeft, onRight));
    })
  }

  private getSearchUsers(){
    const Query = t.type({
      count: tt.NumberFromString,
      search: t.string,
    });
    type Query = t.TypeOf<typeof Query>;

    this.router.get('/user', (req, res, next) => {

      const onLeft = async (errors: t.Errors) => { res.status(400).json(errors) };

      const onRight = async (query: Query) => {
        const users = await UserEntity.searchUserByName(query.search, query.count);

        res.json(users);
      }
      
      pipe(Query.decode(req.query), fold(onLeft, onRight));
    })
  }
}