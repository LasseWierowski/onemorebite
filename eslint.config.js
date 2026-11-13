const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...(Array.isArray(expoConfig) ? expoConfig : [expoConfig]),
  {
    ignores: ['node_modules/*', '.expo/*', 'dist/*', 'coverage/*'],
  },
];
