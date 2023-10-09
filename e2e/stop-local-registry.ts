export default () => {
  if (global.stopLocalRegistry) {
    global.stopLocalRegistry();
  }
};
