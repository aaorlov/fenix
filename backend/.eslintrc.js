module.exports = {
  'extends': ['airbnb'],
  'settings': {},
  'rules': {
    'arrow-parens': ['error', 'as-needed'],
    'no-param-reassign': ["error", { "props": false }],
    'prefer-arrow-callback': ["error", { allowNamedFunctions: true }],
    'comma-dangle': ['error', 'never'],
    'indent': ['error', 2, {'SwitchCase': 1}],
    "import/no-unresolved": "off",
    'max-len': ['error', 120],
    'no-inline-comments': ['error'],
    'no-underscore-dangle': 'off',
    'operator-linebreak': ['error', 'before'],
    'newline-per-chained-call': 'off',
    'require-jsdoc': ['error', {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": true,
        "ClassDeclaration": true,
        "ArrowFunctionExpression": true
      }
    }],
    'semi': ['error', 'always']
  },
  'globals': {
    'expectObservable': true,
    'hot': true,
    'cold': true,
    '__DEV__': false,
    'DEVELOPMENT_MODE': true
  },
  'env': {
    'node': true,
    'es6': true
  },
  "parser": "babel-eslint",
  'parserOptions': {
    'sourceType': 'module',
    'ecmaFeatures': {
      'modules': true,
      'experimentalObjectRestSpread': true
    }
  }
};
