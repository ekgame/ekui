import fs from 'node:fs/promises'
import express from 'express'
import prettier from 'prettier'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : ''

// Create http server
const app = express()

// Add Vite or respective production middlewares
const { createServer } = await import('vite');

/** @type {import('vite').ViteDevServer | undefined} */
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  base,
})

app.use(vite.middlewares)

// Serve HTML
app.use('*all', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '')
    
    // Always read fresh template in development
    let template = await fs.readFile('./index.html', 'utf-8')
    template = await vite.transformIndexHtml(url, template)

    /** @type {import('./sandbox/entry-server.js').render} */
    const render = (await vite.ssrLoadModule('/sandbox/entry-server.js')).render

    const rendered = await render(url)

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, rendered.html ?? '')

    // Format HTML before sending using a library

    const formattedHtml = await prettier.format(html, { parser: 'html' })
    res.status(200).set({ 'Content-Type': 'text/html' }).send(formattedHtml)
  } catch (e) {
    vite?.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
})

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})
