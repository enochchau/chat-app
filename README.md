# WebSocket Land

This is a websocket chat app.

I am mostly trying to learn TypeScript, Parcel, Jest, and TypeORM.

# User Information

* Id
* email: 254 chars 
* name: 5 to 64 chars
* Password 
* Avatar (url)

# Frontend

- [ ] Login
    * [ ] Change username to email
- [x] Register
    * [ ] Change name to email
- [ ] Add Friends
- [ ] Create Groups
- [ ] Chat page
    - For text input, use overflow-wrap
- [ ] Remove Demo user placeholder data
- [ ] User dashboard for changing user information (i.e. Name and password)

Issue with tooltips: https://github.com/chakra-ui/chakra-ui/issues/2869

### Auth forms

* [ ] put limits on input size based on sizes defined in the database models 

#### Login
* email
* pasword

#### Register
* email
* name 
* password
* retype password

## Reach goals
- [ ] implement avatars

# Backend

## Database

* User
    - many to many with other users (aka friends)
    - many to many with groups
* Group
    - many to many with users
* Message
    - many to one with groups

## Chat websocket

- [x] Log websocket messages into db
- [x] send message history when a user connects to the websocket
- [x] chat tracker for groups
- [x] group chat handler
- [x] group chat authenticator

## API

### Group

- [x] GET: get groups for a user
- [x] POST: create a new group
- [x] PATCH: leave a group
- [x] PATCH: add a user to a group

### Friendship
- [x] POST: add a new friend to the current user
- [x] DELETE: remove a friend for the current user
- [x] GET: get all the friends for the current user

### Auth
- [x] POST: login a new user and send back their jwt
- [x] POST: register a new user

### User
- [x] PATCH: change password
- [x] PATCH: change name 
- [x] PATCH: change email 

### Message (stretch goals)
- [ ] PATCH: edit a message
- [ ] DELETE: remove a message

# Tests

### Databse testing

- [ ] Per Entity Testing
- [ ] Message and group testing

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

