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

export {
  getFavorites,
  addFavorite,
  delFavorite,
  toggleFavorite
} from "./favorites.js";
export {
  loadSubreddit,
  loadThread,
  refreshThread,
  refreshSubreddit,
  cacheDate
} from "./loading.js";

import * as ServiceReady from "westend/utils/service-ready.js";
import { init as loadingInit } from "./loading.js";

export const READY_CHANNEL = "model.ready";

export async function init() {
  await loadingInit();

  ServiceReady.signal(READY_CHANNEL);
}
