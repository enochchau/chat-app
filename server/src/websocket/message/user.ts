import { GenericMessage, GenericPayload } from './generic'
// TX User message
export interface TXMessage extends GenericMessage<TXPayload>{
  payload: TXPayload
}
export interface TXPayload extends GenericPayload{
  groupId: number;
}
// RX User message
export interface RXMessage extends GenericMessage<RXPayload> {
  payload: RXPayload
}
export interface RXPayload extends TXPayload{
  token: string;
}