import { User } from "./Client";
import { Message } from "./Messaging";

export type ActionType = "ready" | "messageSent";// | "friendRequest";

export interface Action {}

export interface ReadyAction extends Action {
  user: User;
}

export interface MessageSentAction extends Action {
  user: User;
  message: Message;
}

// export interface FriendRequestAction extends Action {
//   user: User;
// }
