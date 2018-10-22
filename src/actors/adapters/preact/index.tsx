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

import { h, render } from "preact";

import { Actor, ActorHandle, lookup } from "westend-helpers/src/actor/Actor.js";
import {
  isResponse,
  processResponse,
  sendRequest
} from "../../../utils/request-response.js";
import { MessageType as MathMessageType } from "../../math-service.js";

import {
  MessageType as PubSubMessageType,
  PublishMessage
} from "../../pubsub.js";
import { defaultState, State } from "../../state.js";

declare global {
  interface MessageBusType {
    ui: Message;
  }
}

export type Message = PublishMessage;

export default class PreactAdapter extends Actor<Message> {
  private state: State = defaultState;
  private stateActor?: ActorHandle<"state">;
  private pubsubActor?: ActorHandle<"state.pubsub">;
  private lastResult?: number;

  async init() {
    this.stateActor = await lookup("state");
    this.pubsubActor = await lookup("state.pubsub");
    // Subscribe to state updates
    this.pubsubActor!.send({
      actorName: "ui",
      topic: "state",
      type: PubSubMessageType.SUBSCRIBE
    });
  }

  async doMath() {
    const math = await lookup("math");
    const response = await sendRequest(math, {
      a: 40,
      b: 2 * Math.random(),
      requester: "ui",
      type: MathMessageType.DO_MATH
    });
    this.lastResult = response.result;
  }

  async onMessage(msg: Message) {
    if (isResponse(msg) && processResponse(msg)) {
      return;
    }
    this.state = applyPatches(this.state, msg.payload as any);

    render(
      <main>
        <h1>Hai</h1>
        <button onClick={() => this.doMath()}>Do Math!</button>
        <div>Last result: {this.lastResult || "No result yet"}</div>
      </main>,
      document.body,
      document.body.firstChild as any
    );
  }
}
