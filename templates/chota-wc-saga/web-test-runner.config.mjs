const filteredLogs = [
  'Running in dev mode',
  'lit-html is in dev mode',
  'Unable to get Items',
  'unable to modify Item',
];

export default {
  files: ['test/**/*.test.js', 'src/**/*.test.js'],
  group: 'unit',

  nodeResolve: {
    exportConditions: ['browser', 'production'],
  },

  testRunnerHtml: (testFramework) => `
    <html>
      <body>
        <script>window.process = { env: { NODE_ENV: 'production' } };</script>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,

  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (typeof arg === 'string' && filteredLogs.some(l => arg.includes(l))) {
        return false;
      }
    }
    return true;
  },

  coverage: true,
  coverageConfig: {
    exclude: [
      'node_modules/**/*',
      '**/*.stories.js',
      '**/*.type.js',
      '**/app-*.js',
      'src/index.js',
      'src/sw.js',
      'src/styles.js',
      'src/ui/**/*',
      'src/views/**/*',
    ],
  },
};