import { Action, ActionType, ReadyAction } from "./types/Actions";
import { User } from "./types/Client";

export class Client {
  private token: string;

  //private onceExecuted: Action[];

  private events: Map<ActionType, (object: Action) => void> = new Map<ActionType, (object: Action) => void>();

  constructor(token: string) {
    this.token = token;
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

  public login() {
    const user: User = {} as User;
    if (this.events.has("ready")) {
      this.events.get("ready")!({ user } as ReadyAction);
    }
  }
}
