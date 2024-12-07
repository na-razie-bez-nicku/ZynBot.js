import { User } from "./Client";
import { Channel, Guild } from "./Guilds";

export interface Message {
  author: User;
  text: string;
  guild: Guild;
  channel: Channel;
}
