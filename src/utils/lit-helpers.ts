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

// Copied from:
// https://github.com/Polymer/lit-html/blob/master/src/lib/unsafe-html.ts
/**
 * Renders the result as HTML, rather than text.
 *
 * Note, this is unsafe to use with any user-provided input that hasn't been
 * sanitized or escaped, as it may lead to cross-site-scripting
 * vulnerabilities.
 */

import { directive, DirectiveFn, NodePart } from "lit-html";

export const unsafeHTML = (value: any): DirectiveFn<NodePart> =>
  directive(
    (part: NodePart): void => {
      const tmp = document.createElement("template");
      tmp.innerHTML = value;
      part.setValue(document.importNode(tmp.content, true));
    }
  );
