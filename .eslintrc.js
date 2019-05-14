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
  },
  settings: {
    polyfills: ['Object.values', 'fetch', 'promises', 'url'],
  },
};
