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

export class LayerMenu extends HTMLElement {
  static get observedAttributes() {
    return ["slide-width", "slide-zone"];
  }

  animationTime = 0.3;
  animationEasing = "ease-in-out";
  autoAnimateThreshold = 50;

  slideWidth = 0;
  slideZone = 0;

  private dragStart?: number;
  private dragDelta?: number;
  private topElementContainer: HTMLElement;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.innerHTML = `<style>${shadowDomStyles}</style>${shadowDom}`;
    this.topElementContainer = this.shadowRoot!.querySelector(
      "#top"
    ) as HTMLElement;

    this.addEventListener("touchstart", this.onTouchStart.bind(this));
    this.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: true
    });
    this.addEventListener("touchend", this.onTouchEnd.bind(this));
  }

  attributeChangedCallback(name: string, oldVal: string, newVal: string) {
    switch (name) {
      case "slide-width":
        if (isNumber(newVal)) {
          this.slideWidth = Number(newVal);
        }
        break;
      case "slide-zone":
        if (isNumber(newVal)) {
          this.slideZone = Number(newVal);
        }
        break;
    }
  }

  get isOpen() {
    return this.hasAttribute("open");
  }

  get isClosed() {
    return !this.isOpen;
  }

  async open() {
    await animateTo(
      this.topElementContainer,
      `transform ${this.animationTime}s ${this.animationEasing}`,
      {
        transform: `translateX(${-this.slideWidth}px)`
      }
    );
    this.setAttribute("open", "");
  }

  async close() {
    await animateTo(
      this.topElementContainer,
      `transform ${this.animationTime}s ${this.animationEasing}`,
      {
        transform: `translateX(0px)`
      }
    );
    this.removeAttribute("open");
  }

  async toggle() {
    if (this.isOpen) {
      await this.close();
    } else {
      await this.open();
    }
  }

  async reset() {
    if (this.isOpen) {
      await this.open();
    } else {
      await this.close();
    }
  }

  private onTouchStart(ev: TouchEvent) {
    if (ev.touches.length > 1) {
      return;
    }
    const client = ev.touches[0].clientX;
    if (client < this.slideZone) {
      return;
    }
    ev.preventDefault();
    this.dragStart = client;
    this.dragDelta = 0;
  }

  private onTouchMove(ev: TouchEvent) {
    if (this.dragStart === undefined) {
      return;
    }
    ev.stopPropagation();
    const client = ev.touches[0].clientX;
    this.dragDelta = client - this.dragStart;

    // FIXME (@surma): I subtract 1 from slideWidth so that there’s still a
    // transition left to do. Otherwise `transitionend` will never fire.
    const start = this.isOpen ? -(this.slideWidth - 1) : 0;
    const min = this.isOpen ? 0 : -(this.slideWidth - 1);
    const max = this.isOpen ? this.slideWidth - 1 : 0;
    const actualDelta = Math.min(Math.max(this.dragDelta, min), max);
    Object.assign(this.topElementContainer.style, {
      transform: `translateX(calc(${start}px + ${actualDelta}px))`,
      transition: ""
    });
  }

  private async onTouchEnd(ev: TouchEvent) {
    if (this.dragStart === undefined) {
      return;
    }

    if (Math.abs(this.dragDelta!) > this.autoAnimateThreshold) {
      if (this.isOpen) {
        await this.close();
        this.dispatchEvent(new CustomEvent("closegesture"));
      } else {
        await this.open();
        this.dispatchEvent(new CustomEvent("opengesture"));
      }
    } else {
      this.reset();
    }
    this.dragStart = undefined;
  }
}
function isNumber(n: number | string): n is number {
  return !isNaN(Number(n));
}
