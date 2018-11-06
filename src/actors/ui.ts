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

import { State, MessageType as StateMessageType } from "./state.js";

declare global {
  interface ActorMessageType {
    ui: Message;
  }
}

export interface StateMessage {
  state: State;
}

export type Message = StateMessage;

export default class UiActor extends Actor<Message> {
  private state = lookup("state");
  private counterEl = document.getElementById("counter") as HTMLSpanElement;

  async init() {
    const incrButton = document.getElementById(
      "increment"
    ) as HTMLButtonElement;
    incrButton.onclick = () =>
      this.state.send({
        type: StateMessageType.INCREMENT
      });

    const decrButton = document.getElementById(
      "decrement"
    ) as HTMLButtonElement;
    decrButton.onclick = () =>
      this.state.send({
        type: StateMessageType.DECREMENT
      });
  }

  async onMessage(msg: Message) {
    this.counterEl.textContent = `${msg.state.count}`;
  }
}
