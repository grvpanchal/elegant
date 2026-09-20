import { html, useState } from "@runtime";

export default function Counter({ start = 0, step = 1, min = -Infinity, max = Infinity }) {
  const [count, setCount] = useState(start);
  const clamp = (n) => Math.min(max, Math.max(min, n));

  return html`
    <div class="counter">
      <button
        class="counter__dec"
        type="button"
        disabled=${count - step < min}
        onClick=${() => setCount((c) => clamp(c - step))}
        aria-label="Decrease"
      >-</button>
      <output class="counter__value">${count}</output>
      <button
        class="counter__inc"
        type="button"
        disabled=${count + step > max}
        onClick=${() => setCount((c) => clamp(c + step))}
        aria-label="Increase"
      >+</button>
    </div>
  `;
}
