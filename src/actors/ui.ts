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

import { applyPatches } from "immer";

import { Actor, ActorHandle, lookup } from "westend-helpers/src/actor/Actor.js";

import {
  BroadcastMessage,
  MessageType as BroadcastMessageType
} from "./broadcast.js";
import { defaultState, State } from "./state.js";

declare global {
  interface MessageBusType {
    ui: Message;
  }
}

export type Message = BroadcastMessage;

export default class UiActor extends Actor<Message> {
  private state: State = defaultState;
  private broadcastActor?: ActorHandle<"broadcast">;

  private checks = [
    (oldState: State, newState: State) => oldState === newState,
    (oldState: State, newState: State) => oldState.counter === newState.counter,
    (oldState: State, newState: State) =>
      oldState.userSettings === newState.userSettings
  ];

  async init() {
    this.broadcastActor = await lookup("broadcast");
    this.broadcastActor!.send({
      actorName: "ui",
      topic: "state",
      type: BroadcastMessageType.SUBSCRIBE
    });
  }

  async onMessage(msg: Message) {
    const newState = applyPatches(this.state, msg.payload as any);

    document.body.innerHTML = `
<pre>
Counter: ${this.state.counter}

Test if state subobjects are unchanged:
=======================================
${this.checks
      .map(
        check =>
          `* ${/=>(.+)/.exec(check.toString())![1].trim()}: ${check(
            this.state,
            newState
          ).toString()}`
      )
      .join("\n")}
</pre>`;
    this.state = newState;
  }
}
