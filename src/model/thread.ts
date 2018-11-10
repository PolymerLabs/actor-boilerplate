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

export type ThreadID = string;
export interface Thread {
  ago: string;
  author: string;
  body?: string;
  created: number;
  cachedAt: number;
  domain: string;
  downvotes: number;
  fullImage?: string;
  htmlBody?: string;
  id: ThreadID;
  isLink: boolean;
  link?: string;
  nsfw: boolean;
  numComments: number;
  points: number;
  previewImage?: string;
  subreddit: string;
  title: string;
  upvotes: number;
}
