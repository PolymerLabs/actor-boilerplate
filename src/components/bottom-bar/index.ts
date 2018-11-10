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

import { animateTo } from "../../utils/animation.js";
import shadowDomStyles from "./shadowdom-styles.css";
import shadowDom from "./shadowdom.html";

export class BottomBar extends HTMLElement {
  animationTime = 0.7;
  autoAnimateThreshold = 50;

  private bar?: HTMLElement;
  // private barSlot: HTMLSlotElement;
  private barSize: DOMRect | ClientRect = new DOMRect(0, 0, 0, 0);
  private elementSize: DOMRect | ClientRect = new DOMRect(0, 0, 0, 0);
  private dragStartY?: number;
  private dragDelta?: number;
  private lastDragDelta?: number;
  shadowRoot!: ShadowRoot;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${shadowDomStyles}</style>${shadowDom}`;

    // this.addEventListener("touchstart", this.onTouchStart.bind(this), {
    //   passive: true
    // });
    // this.addEventListener("touchmove", this.onTouchMove.bind(this), {
    //   passive: false
    // });
    // this.addEventListener("touchend", this.onTouchEnd.bind(this), {
    //   passive: true
    // });

    // this.barSlot = this.shadowRoot.querySelector(
    //   `slot[name="bar"]`
    // )! as HTMLSlotElement;
    // this.shadowRoot.querySelectorAll("slot").forEach(slot => {
    //   slot.addEventListener("slotchange", this.onSlotChange.bind(this));
    // });
  }

  // get isOpen() {
  //   return this.hasAttribute("open");
  // }

  // get isClosed() {
  //   return !this.isOpen;
  // }

  // async open() {
  //   await animateTo(this, `transform ${this.animationTime}s ${this.easing()}`, {
  //     transform: "translateY(-100vh)"
  //   });
  //   this.setAttribute("open", "");
  // }

  // async close() {
  //   await animateTo(this, `transform ${this.animationTime}s ${this.easing()}`, {
  //     transform: `translateY(-${this.barSize.height}px)`
  //   });
  //   this.removeAttribute("open");
  // }

  // async toggle() {
  //   if (this.isOpen) {
  //     await this.close();
  //   } else {
  //     await this.open();
  //   }
  // }

  // async reset() {
  //   if (this.isOpen) {
  //     await this.open();
  //   } else {
  //     await this.close();
  //   }
  // }

  // private easing() {
  //   let velocity = 50;
  //   if (this.dragDelta && this.lastDragDelta) {
  //     velocity = Math.abs(this.dragDelta - this.lastDragDelta) * 60;
  //   }
  //   return `cubic-bezier(${1 / velocity}, 1, ${1 / velocity}, 1)`;
  // }

  // private onSlotChange(ev: Event) {
  //   this.elementSize = this.getBoundingClientRect();
  //   const assignedNodes = this.barSlot.assignedNodes();
  //   if (assignedNodes.length <= 0) {
  //     return;
  //   }
  //   // this.bar = (this.barSlot.assignedNodes()[0]) as HTMLElement;
  //   // this.barSize = this.bar.getBoundingClientRect();
  //   this.reset();
  // }

  // private isBarElement(el: HTMLElement) {
  //   const assignedNodes = this.barSlot.assignedNodes();
  //   do {
  //     if (assignedNodes.includes(el as any)) {
  //       return true;
  //     }
  //     el = el.parentElement!;
  //   } while (el);
  //   return false;
  // }

  // private onTouchStart(ev: TouchEvent) {
  //   if (ev.touches.length > 1) {
  //     return;
  //   }
  //   const touchElem = ev.composedPath()[0];
  //   const clientY = ev.touches[0].clientY;
  //   if (this.isClosed && !this.isBarElement(touchElem)) {
  //     return;
  //   }
  //   this.dragStartY = clientY;
  //   this.dragDelta = 0;
  // }

  // private onTouchMove(ev: TouchEvent) {
  //   if (this.dragStartY === undefined) {
  //     return;
  //   }
  //   ev.preventDefault();
  //   ev.stopPropagation();

  //   const clientY = ev.touches[0].clientY;
  //   [this.lastDragDelta, this.dragDelta] = [
  //     this.dragDelta,
  //     clientY - this.dragStartY
  //   ];
  //   const start = this.isOpen ? "-100vh" : `-${this.barSize.height}px`;
  //   const min = this.isOpen
  //     ? 0
  //     : -(this.elementSize.height - this.barSize.height);
  //   const max = this.isOpen ? this.elementSize.height - this.barSize.height : 0;
  //   const actualDelta = Math.min(Math.max(this.dragDelta, min), max);
  //   Object.assign(this.style, {
  //     transform: `translateY(calc(${start} + ${actualDelta}px))`,
  //     transition: ""
  //   });
  // }

  // private onTouchEnd(ev: TouchEvent) {
  //   if (this.dragStartY === undefined) {
  //     return;
  //   }

  //   if (Math.abs(this.dragDelta!) > this.autoAnimateThreshold) {
  //     this.toggle();
  //   } else {
  //     this.reset();
  //   }
  //   this.dragStartY = undefined;
  // }
}
