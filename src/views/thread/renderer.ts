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

import { html, TemplateResult } from "lit-html";

import { pluralize } from "../../utils/lang-helpers.js";

import { View, ViewType } from "../../model/view.js";
import { Comment } from "../../model/comment.js";
import { Thread } from "../../model/thread.js";

import { styles } from "./styles.js";

function generateContent(thread: Thread) {
  if (thread.isLink) {
    return html`
    <a href="${
      thread.link
    }" class="content link" style="background-image: url(${thread.fullImage});"></a>
    `;
  } else {
    return html`<div class="content text">${thread.body}</div>`;
  }
}

function generateComment(comment: Comment): TemplateResult {
  const {body, author, points, replies} = comment;

  return html`
<li class="comment">
  <div class="content">
    ${body}
  </div>
  <div class="meta">
    /u/${author} • ${points} ${pluralize("point", points)}
  </div>
  <ul class="comments replies">
    ${replies.map(generateComment)}
  </ul>
</li>
`;
}

export const renderer = (view: View) => {
  if (view.type !== ViewType.THREAD) {
    throw new Error("View is not of type THREAD");
  }

  const {thread, comments} = view;

  return html`
${styles}
<div class="view thread">
  <div class="post">
    <header class="header">
      <h1 class="title">${thread.title}</h1>
      <p class="meta">/u/${thread.author} • <a href="/r/${thread.subreddit}">/r/${thread.subreddit}</a> • ${thread.ago}</p>
      <p class="engagement">${thread.points} ${pluralize("point", thread.points)} • ${thread.numComments} ${pluralize("comment", thread.numComments)}</p>
    </header>
    ${generateContent(thread)}
  </div>
  <ul class="comments">
    ${comments.map(generateComment)}
  </ul>
</div>
`;
};
