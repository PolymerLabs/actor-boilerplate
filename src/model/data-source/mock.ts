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

import { Comment } from "../comment.js";
import { Subreddit, SubredditID } from "../subreddit.js";
import { Thread, ThreadID } from "../thread.js";
import { apiCommentsToComment, apiThreadEntityToThread } from "./reddit.js";

export async function loadSubreddit(id: SubredditID): Promise<Subreddit> {
  const rawData = await fetch("/subreddit.json").then(r => r.json());
  return {
    cachedAt: -1,
    id,
    items: rawData.data.children.map(apiThreadEntityToThread)
  };
}

export async function loadThread(id: ThreadID): Promise<[Thread, Comment[]]> {
  const rawData = await fetch("/thread.json").then(r => r.json());
  return [
    apiThreadEntityToThread(rawData[0].data.children[0]),
    apiCommentsToComment(rawData[1].data.children, id)
  ];
}
