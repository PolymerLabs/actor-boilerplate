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

import { produce } from "immer";

import { Actor, ActorHandle, lookup } from "westend-helpers/src/actor/Actor.js";
import {
  Message as PubSubMessage,
  MessageType as PubSubMessageType
} from "./pubsub.js";

import { Todo } from "../types.js";

declare global {
  interface MessageBusType {
    state: Message;
    "state.pubsub": PubSubMessage;
  }
}

enum MessageType {
  CREATE_TODO,
  DELETE_TODO,
  TOGGLE_TODO
}

export interface CreateMessage {
  type: MessageType.CREATE_TODO;
  title: string;
}

export interface DeleteMessage {
  type: MessageType.DELETE_TODO;
  uid: string;
}

export interface ToggleMessage {
  type: MessageType.TOGGLE_TODO;
  uid: string;
}

export type Message = CreateMessage | DeleteMessage | ToggleMessage;

export type State = Todo[];

export const defaultState = [];

export default class StateActor extends Actor<Message> {
  private statePubSub?: ActorHandle<"state.pubsub">;
  private state: State = [];

  async init() {
    this.statePubSub = await lookup("state.pubsub");
    setInterval(() => {
      this.statePubSub!.send({
        payload: [],
        sourceActorName: "state",
        type: PubSubMessageType.PUBLISH
      });
    }, 1000);
  }

  async onMessage(msg: Message) {
    // Nothing for now.
  }
}
