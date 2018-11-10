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

import htmlMinifier from "html-minifier";

const defaultOpts = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeRedundantAttributes: true
};

const suffixes = ["template.html", ".html", ".svg"];
export default function(opts = {}) {
  return {
    name: "template",

    transform(code, id) {
      if (!suffixes.some(suffix => id.endsWith(suffix))) {
        return;
      }
      code = htmlMinifier.minify(code, { ...defaultOpts, ...opts });
      if (id.endsWith("template.html")) {
        return `
          import {html} from "lit-html/lib/lit-extended.js";
          export default (state, funcs) => html\`${code}\`;
        `;
      }
      return `export default \`${code}\`;`;
    }
  };
}
