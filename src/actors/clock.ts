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

import { Machine } from "xstate/es/Machine.js";
import { Actor, lookup } from "actor-helpers/src/actor/Actor.js";

export enum Action {
  PAUSE = "PAUSE",
  RESET = "RESET",
  RUNNING = "RUNNING",
  START = "START",
  TICK = "TICK"
}

export enum State {
  PAUSED = "paused",
  RESET = "reset",
  RUNNING = "running",
  TICK = "tick"
}

export interface ExternalState {
  time: number;
  running: boolean;
}

export const machineConfig = {
  initial: State.PAUSED,
  states: {
    paused: {
      on: {
        [Action.START]: State.RUNNING,
        [Action.RESET]: State.RESET
      }
    },

    running: {
      on: {
        [Action.PAUSE]: State.PAUSED,
        [Action.TICK]: State.TICK,
        [Action.RESET]: State.RESET
      }
    },

    tick: {
      on: {
        [Action.RUNNING]: State.RUNNING
      }
    },

    reset: {
      on: {
        [Action.PAUSE]: State.PAUSED
      }
    }
  }
};

declare global {
  interface ActorMessageType {
    clock: ClockMessage;
  }
}
export type ClockMessage = Action;

export class Clock extends Actor<ClockMessage> {
  private time = 0;
  private next = -1;
  private machine = Machine(machineConfig);

  private state = this.machine.initialState;
  private ui = lookup("ui");

  async init() {
    await this.notify();
  }

  onMessage(msg: ClockMessage) {
    this.state = this.machine.transition(this.state, msg);

    switch (this.state.value) {
      case State.RUNNING:
        this.setTickTimeout(1000);
        break;

      case State.TICK:
        this.onMessage(Action.RUNNING);
        this.incrementTickCount();
        break;

      case State.PAUSED:
        this.cancelTickTimeout();
        break;

      case State.RESET:
        this.cancelTickTimeout();
        this.resetTickCount();
        this.onMessage(Action.PAUSE);
        break;
    }

    this.notify();
  }

  setTickTimeout(time: number) {
    this.next = self.setTimeout(() => this.onMessage(Action.TICK), time);
  }

  cancelTickTimeout() {
    clearTimeout(this.next);
    this.next = -1;
  }

  incrementTickCount() {
    this.time++;
  }

  resetTickCount() {
    this.time = 0;
  }

  async notify() {
    await this.ui.send({
      time: this.time,
      running: this.state.value === "running"
    });
  }
}
