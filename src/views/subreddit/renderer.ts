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

import { View, ViewType } from "../../model/view.js";

import { pluralize } from "../../utils/lang-helpers.js";

import { download } from "../../icons/download.js";
import { offline } from "../../icons/offline.js";
import {styles} from "./styles.js";

function downloadThread() {}

export const renderer = (view: View) => {
  if (view.type !== ViewType.SUBREDDIT) {
    throw new Error("View is not of type SUBREDDIT");
  }

  return html`
${styles}
<div class="view subreddit">
  ${view.subreddit.items.map(item => {
    const {
      cachedAt,
      previewImage,
      title,
      author,
      subreddit,
      points,
      numComments,
      domain,
      ago,
      id
    } = item;

    return html`
  <layer-menu
    class="item"
    slide-width="80"
    slide-zone="380"
    data-thread-id="${id}"
    ?downloaded="${cachedAt >= 0}"
    @opengesture="${downloadThread}"
  >
    <div slot="top" class="top">
      <div class="preview" style="background-image: url(${previewImage});">
        <div class="dlbadge offline">${offline}</div>
        <div class="dlbadge download">${download}</div>
      </div>
      <a href="/t/${id}" class="title">${title}</a>
      <div class="meta">
        /u/${author} •
        /r/${subreddit} •
        ${ago}
      </div>
      <div class="engagement">
        ${points} ${pluralize("point", points)}
        ${numComments} ${pluralize("comment", numComments)}
        ${domain}
      </div>
    </div>
    <div class="bottom">
      <div class="action">${download}</div>
    </div>

  </layer-menu>
  `;
  })}
</div>
  `;
};
