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
import {
  cacheWrapper,
  isCacheableDataSource
} from "./data-source/cache-wrapper.js";
import { DataSource } from "./data-source/data-source.js";
import { Subreddit, SubredditID } from "./subreddit.js";
import { Thread, ThreadID } from "./thread.js";

import * as RedditDataSource from "./data-source/reddit.js";

export const dataSources = new Map<string, Promise<DataSource>>([
  ["reddit", Promise.resolve(cacheWrapper(RedditDataSource))],
  ["mock", import("./data-source/mock.js")]
]);

export let dataSourceName = "reddit";

function getDataSource(): Promise<DataSource> {
  if (!dataSources.has(dataSourceName)) {
    throw new Error(`Invalid data source ${dataSourceName}`);
  }
  return dataSources.get(dataSourceName)!;
}

export async function loadSubreddit(id: SubredditID): Promise<Subreddit> {
  const dataSource = await getDataSource();
  return dataSource.loadSubreddit(id);
}

export async function loadThread(id: ThreadID): Promise<[Thread, Comment[]]> {
  const dataSource = await getDataSource();
  return dataSource.loadThread(id);
}

export async function refreshThread(id: ThreadID): Promise<void> {
  const dataSource = await getDataSource();
  if (!isCacheableDataSource(dataSource)) {
    return;
  }
  await dataSource.refreshThread(id);
}

export async function refreshSubreddit(id: SubredditID): Promise<void> {
  const dataSource = await getDataSource();
  if (!isCacheableDataSource(dataSource)) {
    return;
  }
  await dataSource.refreshSubreddit(id);
}

export async function cacheDate(id: SubredditID): Promise<number> {
  const dataSource = await getDataSource();
  if (!isCacheableDataSource(dataSource)) {
    return -1;
  }
  return dataSource.cacheDate(id);
}
