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
import { ValidMessageBusName } from "westend-helpers/src/message-bus/MessageBus.js";

export type ValidActorName = ValidMessageBusName;

export type RequestId = string;

function generateUniqueRequestId(): RequestId {
  return [...new Array(16)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");
}
export interface Request {
  requester: string;
  requestId: RequestId;
}

export interface Response {
  requestId: RequestId;
}
declare global {
  interface RequestNameMap {}
  interface RequestNameResponsePairs {}
}

export type ValidRequestName = keyof RequestNameMap;

type PromiseResolver = (x: any) => void;
const waitingRequesters = new Map<RequestId, PromiseResolver>();

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export function sendRequest<
  T extends ValidActorName,
  R extends ValidRequestName
>(
  handle: ActorHandle<T>,
  request: Omit<MessageBusType[T] & Request, "requestId">
): Promise<RequestNameResponsePairs[R]> {
  return new Promise(resolve => {
    const requestId = generateUniqueRequestId();
    const augmentedRequest: MessageBusType[T] & Request = {
      // @ts-ignore
      ...request,
      requestId
    };
    waitingRequesters.set(requestId, resolve);
    handle.send(augmentedRequest);
  });
}

export function processResponse(msg: Response): boolean {
  if (!waitingRequesters.has(msg.requestId)) {
    return false;
  }
  const resolver = waitingRequesters.get(msg.requestId)!;
  resolver(msg);
  return true;
}

export async function sendResponse<R extends ValidRequestName>(
  req: RequestNameMap[R],
  resp: Omit<RequestNameResponsePairs[R], "requestId">
) {
  // @ts-ignore
  const actor = await lookup(req.requester);
  actor.send({
    // @ts-ignore
    ...resp,
    requestId: req.requestId
  });
}

export function isResponse(x: any): x is Response {
  return "requestId" in x && waitingRequesters.has(x.requestId);
}
