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
  Message as PubSubMessage,
  MessageType as PubSubMessageType
} from "./pubsub.js";

declare global {
  interface MessageBusType {
    state: Message;
    "state.update": PubSubMessage;
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
  private pubsubActor?: ActorHandle<"state.update">;
  private state: State = defaultState;

  async init() {
    this.pubsubActor = await lookup("state.update");
    setInterval(() => {
      this.state = produce(
        this.state,
        draft => {
          draft.counter++;
        },
        patches => {
          this.pubsubActor!.send({
            payload: patches,
            sourceActorName: "state",
            type: PubSubMessageType.PUBLISH
          });
        }
      );
    }, 1000);
  }

  async onMessage(msg: Message) {
    // Nothing for now.
  }
}
