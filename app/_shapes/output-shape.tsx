import { BaseBoxShapeUtil, HTMLContainer, RecordProps, T, TLBaseShape } from 'tldraw';
import React from 'react';

export type IOutputShape = TLBaseShape<
	'output-shape',
	{
		w: number;
		h: number;
		value: string;
		isError?: boolean;
		html?: string;
	}
>;

function wrapHTML(html: string) {
	// if (/<script[\s>]/i.test(html)) {
	if (true) {
		return `<iframe srcdoc="${html.replace(/"/g, '&quot;')}" style="width:100%;height:100%;border:none;"></iframe>`;
	}
	return html;
}

export class outputShape extends BaseBoxShapeUtil<IOutputShape> {
	static override type = 'output-shape' as const;
	static override props: RecordProps<IOutputShape> = {
		w: T.number,
		h: T.number,
		value: T.string,
		isError: T.optional(T.boolean),
		html: T.optional(T.string),
	};

	// Remove associated arrow when an output-shape is deleted
	static onBeforeDelete(editor: any, shape: IOutputShape) {
		const arrowId = shape.id.replace(/_output$/, '_arrow');
		if (editor.getShape(arrowId)) {
			editor.run(() => editor.deleteShape(arrowId), { ignoreShapeLock: true });
		}
	}

	getDefaultProps(): IOutputShape['props'] {
		return {
			w: 230,
			h: 230,
			value: '',
			isError: false,
		};
	}

	component(shape: IOutputShape) {
		return (
			<HTMLContainer
				style={{
					height: shape.props.h,
					width: shape.props.w,
					backgroundColor: '#fff',
					borderRadius: 12,
					boxShadow: '0 0px 12px rgba(0,0,0,0.15)',
					outline: '1px solid #dddddd',
					overflow: 'hidden',
					// display: 'flex',
					// alignItems: 'center',
					// justifyContent: 'flex-start',
					padding: 16,
					color: shape.props.isError ? '#c00' : '#222',
					fontSize: 16,
					whiteSpace: 'pre-wrap',
					wordBreak: 'break-word',
					pointerEvents: 'all'
				}}
			>
				{shape.props.html ? (
					<>
						<div
							dangerouslySetInnerHTML={{ __html: wrapHTML(shape.props.html) }}
							style={{ width: '100%', height: '100%', overflow: 'auto', zIndex: 1 }}
						/></>
				) : (
					shape.props.value
				)}
			</HTMLContainer>
		);
	}

	indicator(shape: IOutputShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
	}
}
