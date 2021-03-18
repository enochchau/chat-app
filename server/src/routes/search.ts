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
    this.getSearchGroupsUsers();
  }

  private getSearchGroupsUsers(){
    const ManyQuery = t.type({
      count: tt.NumberFromString,
      search: t.string,
    });
    type ManyQuery = t.TypeOf<typeof ManyQuery>;

    this.router.get('/', (req, res, next) => {
      const onLeft = async (errors: t.Errors) => { res.status(400).json(errors) };

      const onRight = async (query: ManyQuery) => {
        const groups = await GroupEntity.searchGroupByName(query.search, query.count);
        const users = await UserEntity.searchUserByName(query.search, query.count);

        const searchRes: Array<GroupEntity | UserEntity> = [];
        searchRes.concat(users, groups);

        const sortByName = (a: GroupEntity | UserEntity, b: GroupEntity | UserEntity) => {
          const cmpA = a.name;
          const cmpB = b.name;
          if (cmpA > cmpB) return 1;
          if (cmpA < cmpB) return -1;
          return 0;
        }

        searchRes.sort(sortByName);

        res.json(searchRes);
      }

      pipe(ManyQuery.decode(req.query), fold(onLeft, onRight));
    })
  }
}