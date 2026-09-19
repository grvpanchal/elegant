/**
 * <theme-toggle> — the same behaviour with no framework.
 *
 * - cycles system -> light -> dark
 * - "system" follows prefers-color-scheme AND keeps following OS changes
 * - an explicit choice is stored and stops tracking the system
 * - writes documentElement.dataset.theme; the no-flash inline script in <head>
 *   is what decides the FIRST paint, not this element
 * - every localStorage read and write is wrapped in try/catch
 * - the control announces its current state
 */
const MODES = ["system", "light", "dark"];

export class ThemeToggle extends HTMLElement {
  connectedCallback() {
    // Your code here.
    this.innerHTML = `<button type="button">system</button>`;
  }

  disconnectedCallback() {
    // Remember to stop listening to the media query.
  }
}

customElements.define("theme-toggle", ThemeToggle);
