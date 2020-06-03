import { defineComponent, computed, h, ComputedRef, provide } from 'vue'

export default defineComponent({
	name: 'ElRow',
	componentName: 'ElRow',
	props: {
		tag: {
			type: String,
			default: 'div'
		},
		gutter: Number,
		type: String,
		justify: {
			type: String,
			default: 'start'
		},
		align: {
			type: String,
			default: 'top'
		}
	},
	setup(props, { slots }) {
		const style: ComputedRef = computed(() => {
			const ret: any = {}
			if (props.gutter) {
				ret.marginLeft = `-${props.gutter / 2}px`
				ret.marginRight = ret.marginLeft
			}
			return ret
		})

		provide('ElRow', props)

		return () =>
			h(
				props.tag,
				{
					class: [
						'el-row',
						props.justify !== 'start' ? `is-justify-${props.justify}` : '',
						props.align !== 'top' ? `is-align-${props.align}` : '',
						{ 'el-row--flex': props.type === 'flex' }
					],
					style: style
				},
				slots.default && slots.default()
			)
	}
})
