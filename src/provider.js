import { Edge } from "edge.js";

/**
 * @description Ekui plugin for Edge.js
 * @param {Edge} edge 
 */
export const ekuiPluginComponent = (edge) => {
  edge.mount('ekui', new URL('./', import.meta.url));
}