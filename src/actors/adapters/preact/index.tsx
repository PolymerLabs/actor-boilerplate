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
  interface ActorMessageType {
    ui: Message;
  }
}

export type Message = PublishMessage;

export default class PreactAdapter extends Actor<Message> {
  private state: State = defaultState;
  private stateActor = lookup("state");
  private pubsubActor = lookup("state.pubsub");
  private mathActor = lookup("math");
  private lastResult?: number;

  async init() {
    // Subscribe to state updates
    this.pubsubActor.send({
      actorName: "ui",
      type: PubSubMessageType.SUBSCRIBE
    });
  }

  async doMath() {
    const response = await sendRequest(this.mathActor, {
      a: 40,
      b: 2 * Math.random(),
      requester: "ui",
      type: MathMessageType.ADDITION
    });
    this.lastResult = response.result;
  }

  async onMessage(msg: Message) {
    if (processResponse(msg)) {
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
