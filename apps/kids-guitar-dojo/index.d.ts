/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module 'server-only';
declare module 'player.js';
declare module '@madzadev/audio-player';
