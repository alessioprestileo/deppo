// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  env: {
    browser: true,
    es2020: true,
    'jest/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', 'graphql', '@typescript-eslint', 'jest'],
  parser: '@typescript-eslint/parser',
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'consistent-return': 0,
    'function-paren-newline': 0,
    'implicit-arrow-linebreak': 0,
    'import/extensions': [
      2,
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/prefer-default-export': 0,
    indent: 0,
    'jsx-a11y/label-has-associated-control': 0,
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
    'max-classes-per-file': 0,
    'max-len': 0,
    'no-confusing-arrow': 0,
    'no-return-assign': ['error', 'except-parens'],
    'no-underscore-dangle': 0,
    'no-unused-vars': 'off',
    'no-useless-constructor': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { varsIgnorePattern: '[iI]gnored', argsIgnorePattern: '[iI]gnored' },
    ],
    'react/jsx-curly-newline': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-danger': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    semi: 0,
    'graphql/template-strings': [
      'error',
      {
        env: 'relay',
        schemaJsonFilepath: path.resolve(__dirname, './schema.json'),
        tagName: 'graphql',
      },
    ],
  },
}
