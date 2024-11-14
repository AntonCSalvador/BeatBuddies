const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Enable CJS extension support for Expo Router
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    'cjs',
  ];

  // SVG transformer configuration (if applicable)
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };

  config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
  config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

  return config;
})();