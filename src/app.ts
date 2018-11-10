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

import { hookup, initializeQueues } from "actor-helpers/src/actor/Actor.js";
import { UI } from "./actors/ui.js";

async function bootstrap() {
  await initializeQueues();
  const ui = new UI();
  await hookup("ui", ui);

  if (new URL(location.href).searchParams.has("ui-thread-only")) {
    const { Clock } = await import("./actors/clock.js");
    const clock = new Clock();
    await hookup("clock", clock);
  } else {
    const w = new Worker("./worker.js");
    // Safari throttles/freezes worker if they don’t receive messages.
    setInterval(() => w.postMessage(""), 3000);
  }
}

bootstrap();
