import {
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
} from 'tldraw'

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.code_shape = {
			id: 'code-shape',
			icon: 'color',
			label: 'code-shape',
			kbd: 'c',
			onSelect: () => {
				editor.setCurrentTool('code-shape')
			},
		}
		return tools
	},
}

export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isCounterSelected = useIsToolSelected(tools['code_shape'])
		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools['code_shape']} isSelected={isCounterSelected} />
				<DefaultToolbarContent />
			</DefaultToolbar>
		)
	},
}