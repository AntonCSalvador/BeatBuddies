// https://docs.expo.dev/guides/using-eslint/
module.exports = {
    extends: ['expo'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-undef': 'error',                            // Treat undefined variables as an error
      '@typescript-eslint/no-explicit-any': 'error', // Avoid using 'any' type
    }
  };
  