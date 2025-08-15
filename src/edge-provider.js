import { Edge } from "edge.js";

/**
 * @description Custom controls plugin for Edge.js
 * @param {Edge} edge The Edge.js instance to extend with custom components.
 */
export const customControlsPlugin = (edge) => {
  edge.mount('cc', new URL('../templates/edge/', import.meta.url));
}