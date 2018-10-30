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

import { applyPatches, Patch } from "immer";

import { h, render } from "preact";

import { Actor, lookup } from "westend-helpers/src/actor/Actor.js";
import {
  processResponse,
  sendRequest
} from "../../../utils/request-response.js";

import {
  MessageType as PubSubMessageType,
  PublishMessage
} from "../../pubsub.js";
import {
  defaultState,
  MessageType as StateMessageType,
  State
} from "../../state.js";

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

  async init() {
    // Subscribe to state updates
    this.pubsubActor.send({
      actorName: this.actorName!,
      type: PubSubMessageType.SUBSCRIBE
    });

    (async () => {
      const response = await sendRequest(this.stateActor, {
        requester: this.actorName!,
        type: StateMessageType.REQUEST_STATE
      });
      this.state = response.state;
      this.render(this.state);
    })();
  }

  async onMessage(msg: Message) {
    if (processResponse(msg)) {
      return;
    }
    // @ts-ignore
    this[msg.type](msg);
  }

  [PubSubMessageType.PUBLISH](msg: PublishMessage) {
    this.state = applyPatches(this.state, msg.payload as Patch[]);
    this.render(this.state);
  }

  private render(state: State) {
    render(
      <main>
        {state.items.map(item => (
          <label data-uid={item.uid}>
            <input type="checkbox" checked={item.done} />
            <input type="text" value={item.title} />
          </label>
        ))}
        <button
          onClick={() =>
            this.stateActor.send({
              title: "Give me a text!",
              type: StateMessageType.CREATE_TODO
            })
          }
        >
          =
        </button>
      </main>,
      document.body,
      document.body.firstChild as any
    );
  }
}
