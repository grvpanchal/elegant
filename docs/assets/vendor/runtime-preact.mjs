/**
 * The workspace's component runtime.
 *
 * A coding question that declares `{"framework":"preact"}` in its
 * runtime.json can import this module and render real components inside the
 * browser playground. Everything here is vendored — preact.module.js (11 KB)
 * and htm.module.js (1.2 KB) sit next to this file — because the site is
 * static, has no build step, and its own guardrail runs in a sandbox with no
 * outbound network. A CDN import would work in a browser and fail in CI, which
 * is the worst of both.
 *
 * `html` is htm bound to preact's `h`: JSX-shaped markup in a tagged template,
 * so there is nothing to transpile. That is what makes a component runtime
 * possible on a site with no bundler.
 *
 *   import { html, render, mount } from "/assets/vendor/runtime-preact.mjs";
 *
 *   const el = mount();                       // a detached container
 *   render(html`<${Counter} start=${3} />`, el);
 *   el.querySelector("button").click();
 */
import { h, render, Component, Fragment, createRef } from "./preact.module.js";
import htm from "./htm.module.js";
import { useState, useEffect, useMemo, useRef, useCallback } from "./preact.hooks.module.js";

export const html = htm.bind(h);
export { h, render, Component, Fragment, createRef, useState, useEffect, useMemo, useRef, useCallback };

/** A container attached to the document, so focus and layout behave normally. */
export function mount() {
  const host = document.createElement("div");
  host.className = "playground-mount";
  host.style.position = "absolute";
  host.style.left = "-10000px";
  document.body.appendChild(host);
  return host;
}

/** Tear a container down; call it when a test finishes. */
export function unmount(host) {
  if (!host) return;
  render(null, host);
  if (host.parentNode) host.parentNode.removeChild(host);
}

/** Let preact flush and the DOM settle before asserting. */
export function tick() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
