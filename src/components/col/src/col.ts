import { defineComponent, h, computed, inject, ComputedRef } from 'vue'

export default defineComponent({
	name: 'ElCol',
	componentName: 'ElCol',
	props: {
		span: {
			type: Number,
			default: 24
		},
		tag: {
			type: String,
			default: 'div'
		},
		offset: Number,
		pull: Number,
		push: Number,
		xs: [Number, Object],
		sm: [Number, Object],
		md: [Number, Object],
		lg: [Number, Object],
		xl: [Number, Object]
	},
	setup(props: any, { slots }) {
		const gutter: ComputedRef = computed(() => {
			const parent = inject<Data>('ElRow')
			return parent ? parent.gutter : 0
		})
		const classList: Array<string> = []
		const style: any = []

		if (gutter) {
			style.paddingLeft = gutter.value / 2 + 'px'
			style.paddingRight = style.paddingLeft
		}

		;['span', 'offset', 'pull', 'push'].forEach((key: string) => {
			if (props[key] || props[key] === 0) {
				classList.push(
					key !== 'span' ? `el-col-${key}-${props[key]}` : `el-col-${props[key]}`
				)
			}
		})
		;['xs', 'sm', 'md', 'lg', 'xl'].forEach(size => {
			if (typeof props[size] === 'number') {
				classList.push(`el-col-${size}-${props[size]}`)
			} else if (typeof props[size] === 'object') {
				const propSize = props[size]
				Object.keys(propSize).forEach(key => {
					classList.push(
						key !== 'span'
							? `el-col-${size}-${key}-${propSize[key]}`
							: `el-col-${size}-${propSize[key]}`
					)
				})
			}
		})

		return () =>
			h(
				props.tag,
				{
					class: ['el-col', classList],
					style
				},
				slots.default && slots.default()
			)
	}
})
