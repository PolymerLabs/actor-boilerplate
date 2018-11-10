import { Actor, lookup } from "actor-helpers/lib/actor/Actor.js";

import { AppState } from "../model/state.js";
import { View, ViewType } from "../model/view.js";
import { loadSubreddit, loadThread } from "../model/loading.js";

export enum ActionType {
  NAVIGATION,
  COUNTING
}
export interface CountAction {
  counter: number;
  type: ActionType.COUNTING;
}

export interface NavigationAction {
  path: string;
  pathType: ViewType;
  type: ActionType.NAVIGATION;
}

export type Action = NavigationAction | CountAction;

const initialState: AppState = {
  stack: [],
  path: "/r/all"
};

export class StateActor extends Actor<Action> {
  private state = initialState;
  private uiActor = lookup("ui");

  async init() {
    this.sendState();
  }

  private sendState() {
    this.uiActor.send(this.state);
  }

  onMessage(action: Action) {
    // @ts-ignore
    this[action.type](action).then(() => {
      this.sendState();
    });
  }

  async [ActionType.NAVIGATION]({ path, pathType }: NavigationAction) {
    let view: View;

    if (pathType === ViewType.SUBREDDIT) {
      view = {
        type: pathType,
        subreddit: await loadSubreddit(path.substr(3))
      };
    } else if (pathType === ViewType.THREAD) {
      const [thread, comments] = await loadThread(path.substr(3));

      view = {
        type: pathType,
        thread,
        comments
      };
    } else {
      throw new Error(`Invalid path type ${pathType}`);
    }

    this.state = {
      ...this.state,
      stack: [
        ...this.state.stack,
        view
      ],
      path
    };
  }

  async [ActionType.COUNTING](message: CountAction) {}
}
