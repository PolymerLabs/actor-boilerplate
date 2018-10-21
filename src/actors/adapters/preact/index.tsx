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

  async onMessage(msg: Message) {
    this.state = applyPatches(this.state, msg.payload as any);

    render(<h1>Hai</h1>, document.body, document.body.firstChild as any);
  }
}
