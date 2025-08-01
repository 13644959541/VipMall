module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'string-quotes': 'single',
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],
    'font-family-no-missing-generic-family-keyword': null,
    'no-missing-end-of-source-newline': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['for'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
  },
};
