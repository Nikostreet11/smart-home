/*global module*/

module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "jquery": true,
    },
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", "tab"],
        "linebreak-style": ["error", "unix"],
        //"quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "always"],
        "no-cond-assign": ["error", "always"],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],

        // disable rules from base configurations
        "no-console": "off",
    }
}