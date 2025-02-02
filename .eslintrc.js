const path = require('path');
module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        babelOptions: {
            configFile: path.join(__dirname, 'babel.config.js'),
        },
    },
    env: {
        es6: true,
        browser: true,
        node: true,
        'cypress/globals': true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:react/recommended',
        'plugin:jest/style',
        'prettier',
    ],
    plugins: ['import', 'react', 'prettier', 'cypress', 'jest'],
    ignorePatterns: ['src/themes/**/*.js', 'src/app/custom/themes/**/js/*.js'],
    rules: {
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'all',
            },
        ],
        'import/no-extraneous-dependencies': 'off',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
    globals: {
        process: true,
        __DEBUG__: true,
        LOADERS: true,
        __EN__: true,
        __FR__: true,
        ISTEX_API_URL: true,
        jest: true,
        beforeAll: true,
        afterAll: true,
    },
};
