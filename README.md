# WebSocket Land

This is a websocket chat app.

I am mostly trying to learn TypeScript, Parcel, Jest, and TypeORM.

## Database

* User
    * many to many relationship with other users
    * many to many relationship with groups
* Group
    * many to many relationship with users

From these associations we have:
* junction table w/ User and Group FKs
* junction table w/ User and User Fks

