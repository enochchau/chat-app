# WebSocket Land

This is a websocket chat app.

I am mostly trying to learn TypeScript, Parcel, Jest, and TypeORM.

# Frontend

- [x] Login
- [x] Register
- [ ] Add Friends
- [ ] Create Groups
- [ ] Chat page
    - For text input, use overflow-wrap
- [ ] Remove Demo user placeholder data

## Reach goals
- [ ] implement avatars

# Backend

## Database

* User
    - many to many with other users (aka friends)
    - many to many with groups
* Group
    - many to many with users
* MsgFriend
    - many to two users
* MsgGroup
    - many to one group

## Chat websocket

- [ ] Log websocket messages into db
- [ ] send message history when a user connects to the websocket
- [x] chat tracker for groups
- [x] chat tracker for friends
- [x] group chat handler
- [ ] friend chat handler
- [x] group chat authenticator
- [ ] friend chat authenticator

## API

* Check if a group already exists before creating the group

### Group

- [x] GET: get groups for a user
- [x] POST: create a new group
- [ ] DELETE: delete a group
- [ ] PATCH: update the members of the group

### Friendship
- [x] POST: add a new friend to the current user
- [x] DELETE: remove a friend for the current user
- [x] GET: geta all the friends for the current user

### Auth
- [x] POST: login a new user and send back their jwt
- [x] POST: register a new user

## Tests

The database can be seeded with test users and test groups using `./server/src/__test__/entity/seed.ts`.
* testuser0 through testuser9
* groups between testuser0 and all other testusers.

### Databse testing

- [ ] Per Entity Testing

### Websocket

- [ ] Group Chat testing
- [ ] Friend chat testing

### Route testing

#### Auth

- [x] POST /api/auth/register
- [x] POST /api/auth/login 

#### Friend

- [x] POST /api/friend: add friend
    - [x] user tries to add themself which failes
- [x] DELETE /api/friend: remove friend
- [x] GET /api/friend: get all friends of a test user

#### Group

- [x] POST /api/group: create 4 new groups
- [x] GET /api/group: get all of testuser0's grouos 

