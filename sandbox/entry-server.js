import { Edge } from 'edge.js'
import { ekuiPluginComponent } from '../src/edge-provider';

const edge = Edge.create();
edge.mount(new URL('./', import.meta.url));
edge.use(ekuiPluginComponent);

/**
 * @param {string} _url
 */
export async function render(_url) {
  return {
    html: await edge.render('view'),
  };
}
