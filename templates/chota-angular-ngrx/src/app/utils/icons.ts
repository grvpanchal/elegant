/**
 * The Feather icons the atoms draw (https://feathericons.com, MIT licence,
 * (c) 2013-2023 Cole Bemis), inlined so the app loads no icon from the
 * network. They used to come from icongr.am, which no longer resolves.
 *
 * `iconSrc(name, size, color)` takes what the icongr.am URL took (a Feather
 * name, a size in pixels and a hex colour without the "#", black when empty)
 * and returns a data: URL for an <img>. A name that is not below draws
 * nothing. To add an icon, copy the elements inside its <svg> from
 * feather-icons/dist/icons/<name>.svg.
 */
const ICONS: Record<string, string> = {
  'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />',
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />',
  info: '<circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />',
  'trash-2': '<polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />',
  x: '<line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />',
};

const HEX = /^([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function iconSrc(name: string, size: number | string = 24, color = ''): string {
  const px = size || 24;
  const stroke = HEX.test(String(color)) ? `#${color}` : '#000000';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" ` +
    `stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
