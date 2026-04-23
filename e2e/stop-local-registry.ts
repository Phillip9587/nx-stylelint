/* eslint-disable @typescript-eslint/no-explicit-any */
export default () => {
  if ((global as any).stopLocalRegistry) {
    (global as any).stopLocalRegistry();
  }
};
