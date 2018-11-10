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
:root {
  --badge-size: 0.6;
  --badge-icon-size: 0.8;
}
.view.subreddit {
  background-color: var(--primary-b);

  --item-height: 20;
}

.subreddit .item {
  position: relative;
  background-color: var(--primary-b);
  min-height: calc(var(--base) * var(--item-height));

  border-bottom: 1px solid black;
  border-image: linear-gradient(90deg,var(--primary-d) 0%, var(--primary-b) 66%) 1;
}

.subreddit .item .top {
  --item-padding: calc(var(--base) * var(--padding));
  background-color: var(--primary-b);
  height: 100%;
  width: calc(100% - var(--item-padding));

  padding: var(--item-padding);
  padding-right: 0;

  display: grid;
  grid-template-rows: 1fr min-content min-content;
  grid-template-columns: 1fr minmax(calc(var(--base) * var(--item-height)), auto);
}

.subreddit .item .bottom {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: var(--primary1);
  fill: var(--primary1-b);
  padding-right: calc(var(--base) * var(--padding));
}

.subreddit .item .top .preview {
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  grid-area: 1 / -1 / -1 / -2;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  min-height: calc(var(--base) * var(--item-height));
  position: relative;
}

.subreddit .item .top .title {
  color: var(--primary-w);
  grid-area: 1 / 1;
  padding-bottom: 1em;
  padding-right: 1em;
}

@supports (shape-outside: circle(50%)) {
  .subreddit .item .top .title:before {
    content: '';
    display: block;
    float: right;
    width: 25%;
    height: calc(var(--base) * var(--item-height) * 0.4);
    shape-outside: polygon(0 0, 100% 0, 100% 100%);
  }
}

.subreddit .item .top .meta,
.subreddit .item .top .engagement {
  font-size: calc(var(--base) * var(--small-font));
  opacity: calc(var(--opacity-step) * var(--opacity-step));
  grid-area: 2 / 1;
}
.subreddit .item .top .engagement {
  grid-area: 3 / 1;
}

.subreddit .item .bottom {
  background-color: var(--secondary1);
}

.subreddit .item .dlbadge {
  position: absolute;
  top: 0;
  right: 0;
  width: calc(var(--base) * var(--item-height) * var(--badge-size));
  height: calc(var(--base) * var(--item-height) * var(--badge-size));
  background-color: var(--secondary1);
  fill: var(--secondary1-b);
  clip-path: polygon(0 0, 100% 0, 100% 100%);
  display: grid;
  visibility: hidden;
}

.subreddit .item .dlbadge svg {
  /* Width = Height = Radius of triangle incircle = side length / (1 + sqrt(2)/2) */
  --size: calc(var(--base) * var(--item-height) * var(--badge-size) / (1 + var(--sqrt2) / 2));
  position: absolute;
  top: calc(var(--size) * (1 - var(--badge-icon-size)) / 2);
  right: calc(var(--size) * (1 - var(--badge-icon-size)) / 2);
  width: calc(var(--size) * var(--badge-icon-size));
  height: calc(var(--size) * var(--badge-icon-size));
}

.subreddit .item[downloaded] .dlbadge.offline {
  visibility: visible;
}

.subreddit .item[downloading] .dlbadge.downloading {
  visibility: visible;
}
</style>
`;
