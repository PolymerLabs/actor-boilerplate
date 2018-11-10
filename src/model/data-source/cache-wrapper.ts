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

import { del, get, set } from "idb-keyval";

import { Comment } from "../comment.js";
import { Subreddit, SubredditID } from "../subreddit.js";
import { Thread, ThreadID } from "../thread.js";
import { DataSource } from "./data-source.js";

type ThreadData = [Thread, Comment[]];
export interface CacheableDataSource extends DataSource {
  refreshSubreddit(id: SubredditID): Promise<void>;
  refreshThread(id: ThreadID): Promise<void>;
  cacheDate(id: ThreadID): Promise<number>;
}
export function cacheWrapper(source: DataSource): CacheableDataSource {
  return {
    async loadThread(id: ThreadID): Promise<ThreadData> {
      const key = `thread-${id}`;
      const cached = (await get(key)) as ThreadData;
      if (!cached) {
        const live = await source.loadThread(id);
        live[0].cachedAt = Date.now();
        await set(key, live);
        return live;
      }
      return cached;
    },
    async loadSubreddit(id: SubredditID): Promise<Subreddit> {
      const key = `subreddit-${id}`;
      let result = (await get(key)) as Subreddit;
      if (!result) {
        result = await source.loadSubreddit(id);
        result.cachedAt = Date.now();
        await set(key, result);
      }
      for (const item of result.items) {
        item.cachedAt = await this.cacheDate(item.id);
      }
      return result;
    },
    async refreshSubreddit(id: SubredditID): Promise<void> {
      const key = `subreddit-${id}`;
      const old = (await get(key)) as ThreadData;
      await del(key);
      try {
        await this.loadSubreddit(id);
      } catch (e) {
        console.error("Could not refresh subreddit:", e);
        await set(key, old);
      }
    },
    async refreshThread(id: ThreadID): Promise<void> {
      const key = `thread-${id}`;
      const old = (await get(key)) as ThreadData;
      await del(key);
      try {
        await this.loadThread(id);
      } catch (e) {
        console.error("Could not refresh thread:", e);
        await set(key, old);
      }
    },
    async cacheDate(id: ThreadID): Promise<number> {
      const key = `thread-${id}`;
      const thread = (await get(key)) as ThreadData | null;
      if (!thread) {
        return -1;
      }
      return thread[0].cachedAt;
    }
  };
}

export function isCacheableDataSource(
  source: DataSource
): source is CacheableDataSource {
  return "refreshSubreddit" in source && "refreshThread" in source;
}

(self as any).mangleRAll = async () => {
  const s = (await get(`subreddit-all`)) as Subreddit;
  s.items[0].title += "LOL";
  await set("subreddit-all", s);
};
