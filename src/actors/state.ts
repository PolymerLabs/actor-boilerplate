/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import produce from "immer";

import { Actor, ActorHandle, lookup } from "westend-helpers/src/actor/Actor.js";
import {
  Message as BroadcastMessage,
  MessageType as BroadcastMessageType
} from "./broadcast.js";

declare global {
  interface MessageBusType {
    state: Message;
  }
}
export interface Message {}

export interface State {
  userSettings: {
    volume: number;
    brightness: number;
  };
  counter: number;
  name: string;
}

export const defaultState = {
  counter: 0,
  name: "Surma",
  userSettings: {
    brightness: 50,
    volume: 90
  }
};

export default class StateActor extends Actor<Message> {
  private broadcastActor?: ActorHandle<"broadcast">;
  private state: State = defaultState;

  async init() {
    this.broadcastActor = await lookup("broadcast");
    setInterval(() => {
      this.state = produce(
        this.state,
        draft => {
          draft.counter++;
        },
        patches => {
          this.broadcastActor!.send({
            payload: patches,
            sourceActorName: "state",
            topic: "state",
            type: BroadcastMessageType.BROADCAST
          });
        }
      );
    }, 1000);
  }

  async onMessage(msg: Message) {
    // Nothing for now.
  }
}
