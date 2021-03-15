# Testing

## Orm config

Config file is located at `ormconfig.js`.

* Route testing should be done with the `dropSchema` option.
* Entity testing should be done with a pre-seeded database using the `entity/seed.ts` script.


## SQLite

Testing with sqlite is deprecated. Don't do it.

## .env

make sure `NODE_ENV='test'`