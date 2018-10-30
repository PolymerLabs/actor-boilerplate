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

import { Actor } from "westend-helpers/src/actor/Actor.js";
import { Request, Response, sendResponse } from "../utils/request-response.js";

declare global {
  interface ActorMessageType {
    math: Message;
  }
}

declare global {
  interface RequestNameMap {
    DoMathRequest: AdditionRequest;
  }
  interface RequestNameResponsePairs {
    DoMathRequest: ResultResponse;
  }
}

export enum MessageType {
  ADDITION,
  RESULT
}

export type AdditionRequest = {
  type: MessageType.ADDITION;
  a: number;
  b: number;
} & Request;

export type ResultResponse = {
  type: MessageType.RESULT;
  result: number;
} & Response;

export type Message = AdditionRequest;

export default class MathService extends Actor<Message> {
  async onMessage(msg: Message) {
    this[msg.type](msg);
  }

  [MessageType.ADDITION](msg: AdditionRequest) {
    sendResponse(msg, {
      result: msg.a + msg.b,
      type: MessageType.RESULT
    });
  }
}
