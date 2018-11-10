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

import { h, Component } from "preact";

interface Props {
  time: number;
  running: boolean;
}

export class Dial extends Component<Props> {
  render({ time, running }: Props) {
    return (
      <div className={running ? "dial running" : "dial"}>
        <div className="dial__time">{time}</div>
      </div>
    );
  }
}
