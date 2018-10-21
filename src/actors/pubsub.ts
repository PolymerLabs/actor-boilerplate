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

import { Actor, ActorHandle, lookup } from "westend-helpers/src/actor/Actor.js";

declare global {
  interface MessageBusType {
    pubsub: Message;
  }
}

export enum MessageType {
  SUBSCRIBE,
  PUBLISH
}

export interface SubscribeMessage {
  type: MessageType.SUBSCRIBE;
  topic: string;
  actorName: string;
}

export interface PublishMessage {
  type: MessageType.PUBLISH;
  sourceActorName?: string;
  topic: string;
  payload: {};
}

export type Message = SubscribeMessage | PublishMessage;

interface Subscriber {
  name: string;
  handle: ActorHandle<any>;
}

export default class PubSubActor extends Actor<Message> {
  subscribers = new Map<string, Subscriber[]>();

  async init(): Promise<void> {
    // lol
  }

  async onMessage(msg: Message) {
    switch (msg.type) {
      case MessageType.SUBSCRIBE:
        {
          const handle = await lookup(msg.actorName as any);
          const subscribers = this.subscribers.get(msg.topic) || [];
          subscribers.push({
            handle,
            name: msg.actorName
          });
          this.subscribers.set(msg.topic, subscribers);
        }
        break;
      case MessageType.PUBLISH:
        {
          const subscribers = this.subscribers.get(msg.topic) || [];
          for (const { name, handle } of subscribers) {
            if (name === msg.sourceActorName) {
              continue;
            }
            handle.send(msg);
          }
        }
        break;
    }
  }
}
