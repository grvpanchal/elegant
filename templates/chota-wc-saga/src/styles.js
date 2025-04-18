import { css } from 'lit';

export default css`* {
  box-sizing: border-box;
}

html {
  --base-color: #fff;
  --dark-color: #2a3443;
  --shade-color: #5e6673;
  --success-color: #f0f8f1;
  --warning-color: #fbeeec;
  --light-background: #f4f5f7;
  --spacing: 16px;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI',
    Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  margin: 0;
  padding: 0;
  color: var(--dark-color);
  font-size: 18px;
  line-height: 1.5rem;
}

[hidden] {
  display: none;
}

a {
  color: var(--dark-color);
}

a:visited,
a:active {
  color: var(--shade-color);
}

header,
main,
nav {
  padding: var(--spacing);
}

nav {
  height: 3em;
}

header {
  background: var(--dark-color);
  color: var(--base-color);
}
`;