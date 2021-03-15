# Entity Testing

All entity tests rely on a seeded database state.
To seed the database for testing, go to the server root directory at `./server` and run:

```shell
npx ts-node src/__test__/entity/seed.ts
```

Before running tests, turn off the `dropSchema` option in `ormconfig.js`.