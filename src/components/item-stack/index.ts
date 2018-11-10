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

import * as AnimationTools from "../../utils/animation.js";
import shadowDomStyles from "./shadowdom-styles.css";
import shadowDom from "./shadowdom.html";

export interface IsNewFunc {
  (el: HTMLElement): boolean;
}

export function newWeakSetNewFunc(): IsNewFunc {
  const seenItems = new WeakSet<HTMLElement>();
  return (el: HTMLElement) => {
    const isNew = !seenItems.has(el);
    seenItems.add(el);
    return isNew;
  };
}

export class ItemStack extends HTMLElement {
  margin = 20;
  autoAnimateThreshold = 50;
  animationTime = 0.3;
  animationEasing = "ease-in-out";
  isNewFunc: IsNewFunc = newWeakSetNewFunc();

  private dragStart?: number;
  private dragDelta?: number;
  private dismissedItems = new WeakSet<HTMLElement>();
  shadowRoot!: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${shadowDomStyles}</style>${shadowDom}`;
    this.shadowRoot
      .querySelector("slot")!
      .addEventListener("slotchange", this.onSlotChange.bind(this));
    this.addEventListener("touchstart", this.onTouchStart.bind(this), {
      passive: true
    });
    this.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true
    });
    this.addEventListener("touchend", this.onTouchEnd.bind(this), {
      passive: true
    });
  }

  get topItem(): HTMLElement | null {
    let last = this.lastElementChild as HTMLElement;
    while (last && this.dismissedItems.has(last)) {
      last = last.previousElementSibling as HTMLElement;
    }
    if (!last) {
      return null;
    }
    return last as HTMLElement;
  }

  get hasDismissedItems(): boolean {
    const last = this.lastElementChild as HTMLElement;
    return this.dismissedItems.has(last);
  }

  get numItems(): number {
    const childEls = Array.from(this.children) as HTMLElement[];
    return childEls.filter(el => !this.dismissedItems.has(el)).length;
  }

  async dismiss() {
    const item = this.topItem;
    if (!item) {
      return;
    }
    this.dismissedItems.add(item);
    await AnimationTools.animateTo(
      item,
      `transform ${this.animationTime}s ${this.animationEasing}`,
      { transform: "translateX(100%)" }
    );
    item.style.display = "none";
  }

  private onTouchStart(ev: TouchEvent) {
    if (ev.touches.length > 1) {
      return;
    }
    const client = ev.touches[0].clientX;
    if (client > this.margin) {
      return;
    }
    this.dragStart = client;
    ev.stopPropagation();
  }

  private onTouchMove(ev: TouchEvent) {
    if (!this.topItem) {
      return;
    }
    if (this.dragStart === undefined) {
      return;
    }
    ev.stopPropagation();

    const client = ev.touches[0].clientX;
    this.dragDelta = client - this.dragStart;
    const move = Math.max(this.dragDelta, 0);
    Object.assign(this.topItem.style, {
      transform: `translateX(${move}px)`,
      transition: ""
    });
  }

  private async onTouchEnd(ev: TouchEvent) {
    if (!this.topItem) {
      return;
    }
    if (this.dragStart === undefined) {
      return;
    }
    ev.stopPropagation();

    if (this.dragDelta! > this.autoAnimateThreshold) {
      await this.dismiss();
      this.dispatchEvent(new CustomEvent("dismissgesture", { bubbles: true }));
    } else {
      const el = this.topItem;
      await AnimationTools.animateTo(
        el,
        `transform ${this.animationTime}s ${this.animationEasing}`,
        { transform: "" }
      );
    }
    this.dragStart = undefined;
  }

  private onSlotChange(ev: Event) {
    const items = (ev.target! as HTMLSlotElement)
      .assignedNodes()
      .filter(n => n.nodeType === Node.ELEMENT_NODE) as HTMLElement[];
    const newItems = items.filter(item => this.isNewFunc(item));

    newItems.forEach(async item => {
      item.style.transform = "translateX(100%)";
      await AnimationTools.requestAnimationFramePromise();
      await AnimationTools.animateTo(
        item,
        `transform ${this.animationTime}s ${this.animationEasing}`,
        { transform: "" }
      );
      Object.assign(item.style, {
        transform: "",
        transition: ""
      });
    });
  }
}
