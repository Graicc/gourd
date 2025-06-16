"use client"
import { Tldraw } from 'tldraw'
import { useSyncDemo } from '@tldraw/sync'
import 'tldraw/tldraw.css'
import { codeShape, CodeShapeTool } from './_shapes/code-shape'
import { PyodideProvider } from './pyodideContext'
import { outputShape } from './_shapes/output-shape'
import { components, uiOverrides } from './ui'

const customShapeUtils = [codeShape, outputShape]
const customTools = [CodeShapeTool]

export default function App() {
  const store = useSyncDemo({ roomId: 'gourd', shapeUtils: customShapeUtils })

  return (
    <PyodideProvider>
      <div style={{ position: 'fixed', inset: 0 }}>
        {/* <Tldraw store={store}/> */}
        <Tldraw
          store={store}
          options={{ maxPages: 1 }}
          shapeUtils={customShapeUtils}
          tools={customTools}
          overrides={uiOverrides}
          components={components}

          onMount={(editor) => {
            const hasCodeShape = Array.from(editor.getCurrentPageShapeIds()).some(
              id => editor.getShape(id)?.type === 'code-shape'
            );
            if (!hasCodeShape) {
              editor.createShape({
                type: 'code-shape', x: 0, y: 0,
                props: {
                  w: 500,
                  h: 170,
                  code: `import micropip
await micropip.install("plotly")
import plotly.graph_objects as go

fig = go.Figure(data=go.Scatter(x=[1, 2, 3], y=[4, 1, 2]))
fig.update_layout(title='Simple Plot from Pyodide')
fig
`
                }
              });
              editor.centerOnPoint({ x: 500 / 2, y: 170 / 2 })
            }
          }} />
      </div>
    </PyodideProvider>
  )
}