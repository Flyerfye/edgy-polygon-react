// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-undef
module.exports = function override(config, env) {
  // Using react-app-rewired with this override config is necessary in order to use the mirada OpenCV module
  console.log("React app rewired successful");
  config.resolve.fallback = {
    fs: false,
    path: false,
    crypto: false,
  };
  return config;
};
