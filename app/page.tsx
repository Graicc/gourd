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
  const store = useSyncDemo({ roomId: 'gourd-4', shapeUtils: customShapeUtils })

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
            // Register before-delete handler for code-shape and output-shape
            editor.sideEffects.registerBeforeDeleteHandler('shape', (shape) => {
              // alert('test')
              if (shape.type === 'code-shape' && typeof codeShape.onBeforeDelete === 'function') {
                codeShape.onBeforeDelete(editor, shape as any);
              }
              if (shape.type === 'output-shape' && typeof outputShape.onBeforeDelete === 'function') {
                outputShape.onBeforeDelete(editor, shape as any);
              }
              // Allow deletion
              return;
            });
            const hasCodeShape = Array.from(editor.getCurrentPageShapeIds()).some(
              id => editor.getShape(id)?.type === 'code-shape'
            );
            if (!hasCodeShape) {
              editor.createShape({
                type: 'code-shape', x: 0, y: 0,
                props: {
                  w: 500,
                  h: 170,
                  code: `import micropip\nawait micropip.install("plotly")\nimport plotly.graph_objects as go\n\nfig = go.Figure(data=go.Scatter(x=[1, 2, 3], y=[4, 1, 2]))\nfig.update_layout(title='Simple Plot from Pyodide')\nfig\n`
                }
              });
              editor.centerOnPoint({ x: 500 / 2, y: 170 / 2 })
            }
          }} />
      </div>
    </PyodideProvider>
  )
}