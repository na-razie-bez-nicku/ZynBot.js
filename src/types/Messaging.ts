import { User } from "./Client";
import { Channel, Guild } from "./Guilds";

export interface Message {
  author: User;
  content: string;
  id: number;
  reply: number;
  guild: Guild;
  channel: Channel;
  date: Date;
}
