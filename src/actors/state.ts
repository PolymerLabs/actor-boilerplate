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

declare global {
  interface ActorMessageType {
    state: Message;
  }
}

export interface State {
  count: number;
}

export enum MessageType {
  INCREMENT,
  DECREMENT
}

export interface IncrementMessage {
  type: MessageType.INCREMENT;
}

export interface DecrementMessage {
  type: MessageType.DECREMENT;
}

export type Message = IncrementMessage | DecrementMessage;

export default class StateActor extends Actor<Message> {
  private ui = lookup("ui");
  private state: State = {
    count: 0
  };

  async onMessage(msg: Message) {
    switch (msg.type) {
      case MessageType.INCREMENT:
        this.state.count += 1;
        break;
      case MessageType.DECREMENT:
        this.state.count -= 1;
        if (this.state.count <= 0) {
          this.state.count = 0;
        }
        break;
    }
    this.ui.send({
      state: this.state
    });
  }
}
