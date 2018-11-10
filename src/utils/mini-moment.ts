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

export function ago(utc: number, ref: number = Date.now() / 1000) {
  let currentTime = ref - utc;
  let currentLabel = "second";

  const factors: Array<[string, number]> = [
    ["minute", 60],
    ["hour", 60],
    ["day", 24],
    ["week", 7],
    ["year", 52]
  ];

  for (const [label, factor] of factors) {
    if (currentTime / factor < 1) {
      break;
    }
    currentTime = currentTime / factor;
    currentLabel = label;
  }

  currentTime = Math.floor(currentTime);
  return `${currentTime} ${currentLabel}${currentTime === 1 ? "" : "s"} ago`;
}
