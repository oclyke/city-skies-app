module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/style-prop-object': 0,
    'react/prop-types': 0,
    'import/no-unresolved': 0,
  },
};
