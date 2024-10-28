// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": [
    "@typescript-eslint"
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'no-undef': 'error',    
    "@typescript-eslint/ban-types": "error",                        // Treat undefined variables as an error
    '@typescript-eslint/no-explicit-any': 'error', // Avoid using 'any' type
  }
};
