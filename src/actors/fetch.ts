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

import { Actor, lookup } from "actor-helpers/src/actor/Actor.js";

import { MessageType as StateMessageType } from "./state.js";

declare global {
  interface ActorMessageType {
    fetch: Message;
  }
}

export enum MessageType {
  FETCHCREMENT
}

export interface FetchcrementMessage {
  type: MessageType.FETCHCREMENT;
}

export type Message = FetchcrementMessage;

export default class FetchActor extends Actor<Message> {
  private state = lookup("state");

  async onMessage(msg: Message) {
    switch(msg.type) {
      case MessageType.FETCHCREMENT: {
        const response = await fetch('/fetchcrement.json');
        const { type } = await response.json();
        
        switch (type) {
          case "increment": {
            this.state.send({ type: StateMessageType.INCREMENT });
            break;
          }
          case "decrement": {
            this.state.send({ type: StateMessageType.DECREMENT });
            break;
          }
        }
        break;
      }
    }
  }
}
