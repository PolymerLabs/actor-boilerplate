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

import { Todo } from "../types.js";

import { Actor, lookup } from "westend-helpers/src/actor/Actor.js";

import { get, set } from "idb-keyval";

declare global {
  interface MessageBusType {
    storage: Message;
  }
}
export enum MessageType {
  SAVE,
  LOAD,
  REPLY
}

export interface SaveMessage {
  type: MessageType.SAVE;
  payload: Todo[];
}

export interface LoadMessage {
  type: MessageType.LOAD;
  uid: string;
  handle: string;
  payload: Todo[];
}

export type Message = SaveMessage | LoadMessage;

export default class StorageActor extends Actor<Message> {
  async init() {
    // Nothing.
  }

  async onMessage(msg: Message) {
    switch (msg.type) {
      case MessageType.LOAD:
        {
          const todos = (await get("todos")) as Todo[];
          const handle = await lookup(msg.handle as any);
          handle.send({
            payload: todos,
            type: MessageType.REPLY,
            uid: msg.uid
          });
        }
        break;
      case MessageType.SAVE:
        {
          await set("todos", msg.payload);
        }
        break;
    }
  }
}
