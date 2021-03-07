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

* Message
    * Many to one relationship with Group

## Chat websocket

1. Client sends auth token message with room request.
2. Server verifies client, places client into room, and sends client the message history for that room.
4. Client chats.
5. Server logs message, then broadcasts message to all clients in the room.

Messages should be deleted after reaching 24 hours of age.

* client topics:
    * `join room`: authenticate the client, check that they can join that room, add them to the room.
    * `chat`: broadcast a message to all other clients in the room
    * `close`: remove the client from that room