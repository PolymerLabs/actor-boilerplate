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

import { Comment } from "./comment.js";
import { Subreddit } from "./subreddit.js";
import { Thread } from "./thread.js";

export interface ViewBase {
  type: ViewType;
}

export enum ViewType {
  SUBREDDIT,
  THREAD
}

export interface SubredditView extends ViewBase {
  type: ViewType.SUBREDDIT;
  subreddit: Subreddit;
}

export interface ThreadView extends ViewBase {
  type: ViewType.THREAD;
  thread: Thread;
  comments: Comment[];
}

export type View = SubredditView | ThreadView;
