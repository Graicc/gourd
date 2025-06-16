import { BaseBoxShapeTool, BaseBoxShapeUtil, BindingUtil, HTMLContainer, RecordProps, T, TLBaseShape, toRichText } from 'tldraw'
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { usePyodideInShape } from './usePyodideInShape';
import React from 'react';
import { createShapeId, Vec } from 'tldraw';
import { keymap } from '@codemirror/view';
import { outputShape } from './output-shape';

// There's a guide at the bottom of this file!

type ICodeShape = TLBaseShape<
	'code-shape',
	{
		w: number
		h: number
		code: string
	}
>

export class codeShape extends BaseBoxShapeUtil<ICodeShape> {
	static override type = 'code-shape' as const
	static override props: RecordProps<ICodeShape> = {
		w: T.number,
		h: T.number,
		code: T.string,
	}

	getDefaultProps(): ICodeShape['props'] {
		return {
			w: 230,
			h: 230,
			code: '',
		}
	}

	// [1]
	component(shape: ICodeShape) {
		const { pyodide, loading, error } = usePyodideInShape();
		const run = async () => {
			if (!pyodide) return;
			try {
				await pyodide.loadPackage("micropip");
				const result = await pyodide.runPythonAsync(shape.props.code);
				let html: string | null = null;
				if (result && typeof (result as any)._repr_html_ === 'function') {
					html = await (result as any)._repr_html_();
				}
				const resultText = html ?? result?.toString() ?? 'nothing';
				createOutputAndArrow(this.editor, shape, resultText, false, html ?? undefined);
			} catch (e: any) {
				const errorText = e.message;
				createOutputAndArrow(this.editor, shape, errorText, true);
			}
		};
		const runKeymap = React.useMemo(() => keymap.of([{
			key: 'Alt-Enter',
			run: () => {
				run();
				return true; // Prevents new line
			},
		}]), [pyodide, shape.props.code]);
		return (
			<div style={{ position: 'relative', width: shape.props.w }}>
				<HTMLContainer
					style={{
						// padding: 8,
						height: shape.props.h,
						width: shape.props.w,
						pointerEvents: 'all',
						overflow: 'hidden',
						boxShadow: '0 0px 12px rgba(0,0,0,0.15)',
						borderRadius: 12, // Added rounded corners
						outline: '1px solid #dddddd',
					}}
				>
					<CodeMirror
						value={shape.props.code}
						extensions={[python(), runKeymap]}
						onChange={(code) => this.editor.updateShape<ICodeShape>({ id: shape.id, type: 'code-shape', props: { code } })}
						basicSetup={{ lineNumbers: true }}
						className='h-full'
						height="100%"
					/>
				</HTMLContainer>
				<HTMLContainer style={{
					pointerEvents: 'all',
				}}>
					<button
						onClick={run}
						disabled={loading}
						className="text-xl"
						style={{
							position: 'absolute',
							top: shape.props.h + 12,
							left: 8,
							zIndex: 1,
							backgroundColor: '#f5f5f5',
							boxShadow: '0 0px 12px rgba(0,0,0,0.15)',
							borderRadius: 12, // Added rounded corners
							padding: 8,
							outline: '1px solid #dddddd'
						}}
					>
						{loading ? 'Loading Pyodide...' : 'Run'}
					</button>
				</HTMLContainer>
			</div>
		)
	}

	// [5]
	indicator(shape: ICodeShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

function createOutputAndArrow(editor: any, codeShape: any, outputText: string, isError = false, htmlOutput?: string) {
	const outputShapeId = `${codeShape.id}_output`;
	const arrowId = `${codeShape.id}_arrow`;
	const outputX = codeShape.x + codeShape.props.w + 40;
	const outputY = codeShape.y;

	// Upsert output custom shape
	const existingOutput = editor.getShape(outputShapeId);
	if (existingOutput) {
		editor.updateShape({
			id: outputShapeId,
			type: 'output-shape',
			x: outputX,
			y: outputY,
			props: {
				...existingOutput.props,
				value: outputText,
				html: htmlOutput,
				isError,
			},
		});
	} else {
		editor.createShape({
			id: outputShapeId,
			type: 'output-shape',
			x: outputX,
			y: outputY,
			props: {
				value: outputText,
				html: htmlOutput,
				isError,
			},
		});
	}

	// Arrow logic
	const startShapePageBounds = editor.getShapePageBounds(codeShape.id);
	const endShapePageBounds = editor.getShapePageBounds(outputShapeId);
	if (!startShapePageBounds || !endShapePageBounds) return;
	const startNormalizedAnchor = { x: 1, y: 0.5 };
	const endNormalizedAnchor = { x: 0, y: 0.5 };
	const startTerminalNormalizedPosition = Vec.From(startNormalizedAnchor);
	const endTerminalNormalizedPosition = Vec.From(endNormalizedAnchor);
	const startShapePageRotation = editor.getShapePageTransform(codeShape.id).rotation();
	const endShapePageRotation = editor.getShapePageTransform(outputShapeId).rotation();
	const startTerminalPagePosition = Vec.Add(
		startShapePageBounds.point,
		Vec.MulV(
			startShapePageBounds.size,
			Vec.Rot(startTerminalNormalizedPosition, startShapePageRotation)
		)
	);
	const endTerminalPagePosition = Vec.Add(
		endShapePageBounds.point,
		Vec.MulV(
			endShapePageBounds.size,
			Vec.Rot(endTerminalNormalizedPosition, endShapePageRotation)
		)
	);
	const arrowPointInParentSpace = Vec.Min(startTerminalPagePosition, endTerminalPagePosition);

	const existingArrow = editor.getShape(arrowId);
	if (existingArrow) {
		editor.updateShape({
			id: arrowId,
			type: 'arrow',
			x: arrowPointInParentSpace.x,
			y: arrowPointInParentSpace.y,
			props: {
				...existingArrow.props,
				start: { x: arrowPointInParentSpace.x - startTerminalPagePosition.x, y: arrowPointInParentSpace.y - startTerminalPagePosition.y },
				end: { x: arrowPointInParentSpace.x - endTerminalPagePosition.x, y: arrowPointInParentSpace.y - endTerminalPagePosition.y },
			},
			isLocked: true,
		});
	} else {
		editor.createShape({
			id: arrowId,
			type: 'arrow',
			x: arrowPointInParentSpace.x,
			y: arrowPointInParentSpace.y,
			props: {
				start: { x: arrowPointInParentSpace.x - startTerminalPagePosition.x, y: arrowPointInParentSpace.y - startTerminalPagePosition.y },
				end: { x: arrowPointInParentSpace.x - endTerminalPagePosition.x, y: arrowPointInParentSpace.y - endTerminalPagePosition.y },
			},
			isLocked: true,
		});
		// Only create bindings if arrow is new
		editor.createBindings([
			{
				fromId: arrowId,
				toId: codeShape.id,
				type: 'arrow',
				props: {
					terminal: 'start',
					normalizedAnchor: startNormalizedAnchor,
					isPrecise: false,
				},
			},
			{
				fromId: arrowId,
				toId: outputShapeId,
				type: 'arrow',
				props: {
					terminal: 'end',
					normalizedAnchor: endNormalizedAnchor,
					isPrecise: false,
				},
			},
		]);
	}
}

export class CodeShapeTool extends BaseBoxShapeTool {
	static override id = 'code-shape'
	override shapeType = 'code-shape'
}

/* 
This is a custom shape, for a more in-depth look at how to create a custom shape,
see our custom shape example.

[1]
This is where we describe how our shape will render

	[a] We need to set pointer-events to all so that we can interact with our shape. This CSS property is
	set to "none" off by default. We need to manually opt-in to accepting pointer events by setting it to
	'all' or 'auto'. 

	[b] We need to stop event propagation so that the editor doesn't select the shape
		when we click on the checkbox. The 'canvas container' forwards events that it receives
		on to the editor, so stopping propagation here prevents the event from reaching the canvas.
	
	[c] If the shape is not checked, we stop event propagation so that the editor doesn't
		select the shape when we click on the input. If the shape is checked then we allow that event to
		propagate to the canvas and then get sent to the editor, triggering clicks or drags as usual.

*/