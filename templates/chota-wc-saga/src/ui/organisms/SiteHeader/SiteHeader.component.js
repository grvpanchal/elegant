import { html } from 'lit';
import useComputedStyles from '../../../utils/theme/hooks/useComputedStyles.js';
import style from './SiteHeader.style.js';

export default function SiteHeader({ headerData, events }) {
  useComputedStyles(this, [style]);

  const { brandName, theme } = headerData;
  const { onThemeChangeClick } = events;
  return html`
    <br />
    <br />
    <div style=${`display: flex; justify-content: space-between;`}>
      <div>
        <h1>${brandName}</h1>
      </div>
      <div>
        <h1 role="button" @click=${() => onThemeChangeClick()} class="text-right pointer">${theme === "dark" ? "☀️" : "🌙"}</h1>
      </div>
    </div>
    <br />
  `;
}
