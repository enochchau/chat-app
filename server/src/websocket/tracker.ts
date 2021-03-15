import WebSocket from 'ws';

type userId = number;
export type ChatGroup = Set<WebSocket>;

// Map<groupId, Array<IdWs>>
export type GroupTracker = Map<number, ChatGroup>;