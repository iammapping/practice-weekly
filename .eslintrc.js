module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    'linebreak-style': 0,
    'no-unused-vars': 0,
    'no-unused-expressions': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
  },
  settings: {
    polyfills: ['Object.values', 'fetch', 'promises', 'url'],
  },
};
