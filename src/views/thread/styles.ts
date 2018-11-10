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

import { html } from "lit-html";

export const styles = html`
<style>
.view.thread {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: var(--primary-b);
}

@supports (shape-outside: circle(50%)) {
  .thread .title:before {
    display: block;
    content: '';
    float: right;
    width: 25vmin;
    height: 1em;
    shape-outside: polygon(0 0, 100% 0, 100% 100%);
  }
}

.thread .post .header {
  background-color: var(--primary-dd);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: calc(2 * var(--base) * var(--padding)) calc(var(--base) * var(--padding));
}

.thread .post .content {
  background-color: var(--primary-dd);
  padding: calc(2 * var(--base) * var(--padding)) calc(var(--base) * var(--padding));
  width: 100%;
}

.thread .post .content.link {
  display: block;
  padding: 0;
  background-size: contain;
  min-height: 25vh;
  background-repeat: no-repeat;
}

.thread .post .title {
  display: block;
  font-weight: bold;
  font-size: calc(var(--base) * var(--big-font));
  padding-bottom: calc(2 * var(--base) * var(--padding));
}

.thread .meta, .thread .engagement {
  font-size: calc(var(--base) * var(--small-font));
  opacity: calc(var(--opacity-step) * var(--opacity-step));
}

.thread > .comments {
  padding-top: calc(var(--base) * var(--padding));
  padding-right: calc(var(--base) * var(--padding));
}

.thread .comments .comment {
  padding-left: calc(var(--base) * var(--padding));
  overflow-x: auto;
}

.thread .comment > .comments {
  border-left: 1px solid var(--primary-dd);
  margin-top: calc(var(--base) * var(--padding));
}

.thread .content b, strong {
  font-weight: bold;
}

.thread .content i, em {
  font-style: italic;
}

.thread .content p {
  margin: calc(var(--base) * var(--padding)) 0;
}
`;
