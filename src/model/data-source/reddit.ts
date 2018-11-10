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

import { decodeHTML } from "../../utils/dom-helpers.js";
import { ago } from "../../utils/mini-moment.js";

export interface ApiSubreddit {
  data: {
    modhash: string;
    dist: number;
    children: ApiThreadEntity[];
  };
  kind: "Listing";
}

export interface ApiPreviewImageVersion {
  height: number;
  url: string;
  width: number;
}

export interface ApiPreviewImage {
  source: ApiPreviewImageVersion;
  resolutions: ApiPreviewImageVersion[];
  variants: {};
  id: string;
}

export interface ApiThreadEntity {
  data: {
    author: string;
    created_utc: number;
    distinguished: "moderator" | false;
    domain: string;
    downs: number;
    edited: boolean;
    gilded: number;
    locked: boolean;
    media_embed: {};
    id: string;
    is_self: boolean;
    name: string;
    num_comments: number;
    over_18: boolean;
    preview: {
      enabled: boolean;
      images: ApiPreviewImage[];
    };
    score: number;
    selftext: string;
    selftext_html: string | null;
    spoiler: boolean;
    stickied: boolean;
    subreddit: string;
    thumbnail: string;
    thumbnail_width: number | null;
    title: string;
    url: string;
    ups: number;
  };
  kind: "t3";
}

export interface ApiComment {
  data: {
    author: string;
    body: string;
    body_html: string;
    created_utc: number;
    depth: number;
    distinguished: "moderator" | false;
    downs: number;
    edited: boolean;
    gilded: number;
    id: string;
    link_id: string;
    name: string;
    parent_id: string;
    score: number;
    subreddit: string;
    subreddit_id: string;
    ups: number;
    replies:
      | {
          kind: "Listing";
          data: {
            modhash: "";
            dist: null;
            children: ApiComment[];
          };
        }
      | "";
  };
  kind: "t1";
}

export type ApiThread = [
  {
    kind: "Listing";
    data: {
      modhash: "";
      dist: null;
      children: ApiThreadEntity[];
    };
  },
  {
    kind: "Listing";
    data: {
      modhash: "";
      dist: null;
      children: ApiComment[];
    };
  }
];

export function sanitizeUrl(url: string) {
  return url.split("&amp;").join("&");
}

export function apiThreadEntityToThread(te: ApiThreadEntity): Thread {
  const thread: Thread = {
    ago: ago(te.data.created_utc),
    author: te.data.author,
    body: te.data.selftext,
    cachedAt: -1,
    created: te.data.created_utc,
    domain: te.data.domain,
    downvotes: te.data.downs,
    htmlBody: decodeHTML(te.data.selftext_html || ""),
    id: te.data.name,
    isLink: !te.data.is_self,
    link: te.data.url,
    nsfw: te.data.over_18,
    numComments: te.data.num_comments,
    points: te.data.score,
    subreddit: te.data.subreddit,
    title: te.data.title,
    upvotes: te.data.ups
  };

  if (te.data.preview && te.data.preview.images.length >= 1) {
    thread.fullImage = sanitizeUrl(te.data.preview.images[0].source.url);

    const previewCandidate = te.data.preview.images[0].resolutions.find(
      variant => variant.height <= 200
    );
    if (previewCandidate) {
      thread.previewImage = sanitizeUrl(previewCandidate.url);
    }
  }
  return thread;
}

export function apiCommentsToComment(
  comments: ApiComment[],
  parentId: string
): Comment[] {
  return comments
    .filter(comment => comment.kind === "t1")
    .filter(comment => comment.data.parent_id === parentId)
    .map(comment => ({
      ago: ago(comment.data.created_utc),
      author: comment.data.author,
      body: comment.data.body,
      comment: comment.data.body,
      downvotes: comment.data.downs,
      htmlBody: decodeHTML(comment.data.body_html),
      id: comment.data.name,
      points: comment.data.score,
      replies:
        comment.data.replies === ""
          ? []
          : apiCommentsToComment(
              comment.data.replies.data.children,
              comment.data.name
            ),
      upvotes: comment.data.ups
    }));
}

export async function loadSubreddit(id: SubredditID): Promise<Subreddit> {
  const rawData = await fetch(`https://www.reddit.com/r/${id}/.json`).then(r =>
    r.json()
  );
  return {
    cachedAt: -1,
    id,
    items: rawData.data.children.map(apiThreadEntityToThread)
  };
}

export async function loadThread(id: ThreadID): Promise<[Thread, Comment[]]> {
  const rawData = await fetch(
    `https://www.reddit.com/${id.substr(3)}/.json`
  ).then(r => r.json());
  return [
    apiThreadEntityToThread(rawData[0].data.children[0]),
    apiCommentsToComment(rawData[1].data.children, id)
  ];
}
