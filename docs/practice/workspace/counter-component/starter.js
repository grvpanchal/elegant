import { html, useState } from "@runtime";

/**
 * Counter component.
 *
 * Props: { start = 0, step = 1, min = -Infinity, max = Infinity }
 *
 * Render:
 *   <div class="counter">
 *     <button class="counter__dec">-</button>
 *     <output class="counter__value">{count}</output>
 *     <button class="counter__inc">+</button>
 *   </div>
 *
 * - starts at `start`, moves by `step`
 * - clamps at `min` and `max`; a button that cannot move is `disabled`
 * - the value is in an <output>, so a screen reader announces the change
 */
export default function Counter({ start = 0, step = 1, min = -Infinity, max = Infinity }) {
  // Your code here.
  return html`<div class="counter"></div>`;
}
