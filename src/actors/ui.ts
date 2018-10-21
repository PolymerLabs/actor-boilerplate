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

import { MessageType as PubSubMessageType, PublishMessage } from "./pubsub.js";
import { defaultState, State } from "./state.js";

declare global {
  interface MessageBusType {
    ui: Message;
  }
}

export type Message = PublishMessage;

export default class UiActor extends Actor<Message> {
  private state: State = defaultState;
  private pubsubActor?: ActorHandle<"pubsub">;

  private checks = [
    (oldState: State, newState: State) => oldState === newState,
    (oldState: State, newState: State) => oldState.counter === newState.counter,
    (oldState: State, newState: State) => oldState.name === newState.name,
    (oldState: State, newState: State) =>
      oldState.userSettings === newState.userSettings
  ];

  async init() {
    this.pubsubActor = await lookup("pubsub");
    this.pubsubActor!.send({
      actorName: "ui",
      topic: "state",
      type: PubSubMessageType.SUBSCRIBE
    });
  }

  async onMessage(msg: Message) {
    const newState = applyPatches(this.state, msg.payload as any);

    document.body.innerHTML = `
<pre>
State:

${JSON.stringify(newState, null, "  ")}

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
