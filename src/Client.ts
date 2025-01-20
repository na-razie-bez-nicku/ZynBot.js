import { Action, ActionType, ReadyAction } from "./types/Actions";
import { User } from "./types/Client";
import { io, Socket } from "socket.io-client";
import { Message } from "./types/Messaging";
import { Channel } from "./types/Guilds";

export class Client {
  private token: string;
  private id: number;
  private autoAcceptFriendRequest: boolean = true;

  private user_info: any;
  private socket: Socket = io("https://zyntra.xyz", { autoConnect: true });

  //private onceExecuted: Action[];

  private events: Map<ActionType, (object: Action) => void> = new Map<
    ActionType,
    (object: Action) => void
  >();

  constructor(
    token: string,
    id: number,
    autoAcceptFriendRequest: boolean = true
  ) {
    this.token = token;
    this.id = id;
    this.autoAcceptFriendRequest = autoAcceptFriendRequest;
  }

  public on(action: ActionType, callback: (object: Action) => void) {
    this.events.set(action, callback);
    // switch (action) {
    //   case "ready":
    //     const user: User = {} as User;
    //     this.events.set("ready", callback({ user } as ReadyAction));
    //     break;
    // }
  }

  // public once(action: ActionType, callback: (object: Action) => void) {
  //   this.events.set(action, callback);
  // }

  public async login() {
    const response = await fetch("https://zyntra.xyz/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionSecret: this.token, id: this.id }),
    });

    this.user_info = await response.json();

    console.log(this.user_info);

    const user: User = {
      username: this.user_info.username,
      id: this.id,
    } as User;

    this.socket.emit("userConnected", {
      uid: this.id,
      auth: this.user_info.auth,
    });
    if (this.events.has("messageSent"))
      this.socket.on("messageReceived", async (from: any) => {
        const response = await fetch(
          "https://zyntra.xyz/auth/getUserData?id=" + from.from,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({ id:  }),
          }
        );
        const username = (await response.json()).username;
        this.events.get("messageSent")!({
          author: { id: from.from, username } as User,
          channel: { id: from.channel } as Channel,
          text: from.message,
          date: from.date,
          id: from.messageId,
          reply: from.reply,
        } as Message);
      });

    if (this.autoAcceptFriendRequest) {
      const response = await fetch(
        "https://zyntra.xyz/auth/getFriendRequests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ auth: this.user_info.auth, id: this.id }),
        }
      );

      (await response.json()).forEach(async (user: any) => {
        console.log(user);
        await fetch("https://zyntra.xyz/auth/acceptFriendRequest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auth: this.user_info.auth,
            id: this.id,
            friendId: user.id,
          }),
        });
      });

      this.socket.on("friendRequestUpdate", async (data) => {
        const { state } = data;
        if (state != 0) return;
        const response = await fetch(
          "https://zyntra.xyz/auth/getFriendRequests",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ auth: this.user_info.auth, id: this.id }),
          }
        );

        (await response.json()).forEach(async (user: any) => {
          console.log(user);
          await fetch("https://zyntra.xyz/auth/acceptFriendRequest", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              auth: this.user_info.auth,
              id: this.id,
              friendId: user.id,
            }),
          });
        });
      });
    }

    if (this.events.has("ready"))
      this.events.get("ready")!({ user } as ReadyAction);
  }

  public async sendMessage(channel_id: number, message: string) {
    await this.socket.emit("sendToAccessPoint", {
      uid: this.id,
      auth: this.user_info.auth,
      message,
      accessPoint: channel_id,
    });
  }

  public async reply(channel_id: number, message: string, reply: number) {
    await this.socket.emit("sendToAccessPoint", {
      uid: this.id,
      auth: this.user_info.auth,
      message,
      accessPoint: channel_id,
      reply,
    });
  }
}
