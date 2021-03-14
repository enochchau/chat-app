import WebSocket from 'ws';

type userId = number;
export type ChatGroup = Map<userId, WebSocket>;

// Map<groupId, Array<IdWs>>
export type GroupTracker = Map<number, Map<number, WebSocket>>;