import { Action, ActionType, ReadyAction } from "./types/Actions";

export class Client {
  private token;

  constructor(token: string) {
    this.token = token;
  }

  public on(action: ActionType, callback: (object: Action) => void) {
    switch (action) {
      case "ready":
        callback({} as ReadyAction);
        break;
    }
  }

  public once(action: ActionType, callback: (object: Action) => void) {
    switch (action) {
      case "ready":
        callback({} as ReadyAction);
        break;
    }
  }

  public login() {}
}
