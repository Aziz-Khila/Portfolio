export type WorkMedia = {
  el: HTMLElement;
  video: HTMLVideoElement;
  hover: boolean;
  mouse: { x: number; y: number };
};

/** DOM cards register here so the WebGL layer can mirror their position, hover and video. */
export const workRegistry = new Map<string, WorkMedia>();
