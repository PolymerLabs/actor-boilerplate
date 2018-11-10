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

import { get, set } from "idb-keyval";

import { SubredditID } from "./subreddit.js";

const FAVORITES_KEY = "favorites";
export async function getFavorites(): Promise<SubredditID[]> {
  const favorites = (await get(FAVORITES_KEY)) as SubredditID[] | null;
  if (!favorites) {
    await set(FAVORITES_KEY, []);
    return [];
  }
  return favorites;
}

export async function addFavorite(id: SubredditID): Promise<void> {
  let favorites = (await get(FAVORITES_KEY)) as SubredditID[] | null;
  if (!favorites) {
    favorites = [];
  }
  if (!favorites.includes(id)) {
    favorites.push(id);
  }
  await set(FAVORITES_KEY, favorites);
}

export async function delFavorite(id: SubredditID): Promise<void> {
  let favorites = (await get(FAVORITES_KEY)) as SubredditID[] | null;
  if (!favorites) {
    favorites = [];
  }
  favorites = favorites.filter(entry => entry !== id);
  await set(FAVORITES_KEY, favorites);
}

export async function toggleFavorite(id: SubredditID): Promise<void> {
  let favorites = (await get(FAVORITES_KEY)) as SubredditID[] | null;
  if (!favorites) {
    favorites = [];
  }
  if (favorites.includes(id)) {
    await delFavorite(id);
  } else {
    await addFavorite(id);
  }
}
