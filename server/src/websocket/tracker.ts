import WebSocket from 'ws';
type groupId = number;
export type ChatGroup = Set<WebSocket>;
export type GroupTracker = Map<groupId, ChatGroup>;