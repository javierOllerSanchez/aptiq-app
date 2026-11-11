const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// El logotipo se carga tal cual desde docs/marca/ (fuente única) y lo pinta expo-image.
config.resolver.assetExts.push('svg');

module.exports = config;
