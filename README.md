# WebSocket Land

This is a simple websocket chat app.

I am mostly trying to learn TypeScript and Parcel.

## Tests

* Figure out how to clean up the db between tests.
[https://github.com/nestjs/nest/issues/409]

## Database

* User
    * many to many relationship with other users
    * many to many relationship with groups
* Group
    * many to many relationship with users

From these associations we have:
* junction table w/ User and Group FKs
* junction table w/ User and User Fks