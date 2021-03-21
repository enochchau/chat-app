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
    - [ ] handle incoming websocket messages
        - [x] handle chat messages
        - [ ] handle server messages
    - [x] handle outgoing websocket messages
    - [ ] get group meta data
        - [ ] get last messages
- [ ] Remove Demo user placeholder data
- [ ] User dashboard for changing use information (i.e. Name and password)

Issue with tooltips: https://github.com/chakra-ui/chakra-ui/issues/2869

## Creating a new group

Groups of two people should be treated a little differently from groups of three or more people.

1. The user clicks on the icon to create a new group.
1. User chooses first name from search results.
2. Post userId and first name id and create a new group
    1. If that group already exists, the existing group id will be returned
    2. If the group doesn't exist, it will create the new group
3. if the user searches for and clicks another user, create a new group with 3 users in it
4. if the user searches for and clicks any subsequent users, patch in that user to the group created in step 3.

## Searching for exisiting groups

1. User clicks on the search.
2. Hide the current list of groups and show the search result list
3. As the user searches, use debounced api calls to fetch existing groups.
4. When the user clicks on a searched group, redirect them to that groupId.

## Clicking on groups in the left panel

1. The user clicks on the group
2. Redirect the user to the url with that group Id
3. fetch all relevant group meta data using 'getGroupsWithUsers' api call.

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

- [ ] Create an event handler on the group to update the `updated` column whenever a new message is created that is associated with that group.

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

## Todo

1. Get all the tests to run together.
1. Disconnect entity testing from requiring a seeded database

### Databse testing

- [ ] Per Entity Testing
- [ ] Message and group testing

### Websocket

- [x] Chat testing

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

