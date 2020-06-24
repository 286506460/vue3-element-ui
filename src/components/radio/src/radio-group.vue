<template>
	<component :is="_elTag" class="el-radio-group" role="radiogroup" ref="radioGroup">
		<slot></slot>
	</component>
</template>

<script lang="ts">
import { defineComponent, provide, ComputedRef, computed, inject } from 'vue'

export default defineComponent({
	name: 'ElRadioGroup',
	componentName: 'ElRadioGroup',
	props: {
		modelValue: {},
		size: String,
		fill: String,
		textColor: String,
		disabled: Boolean
	},
	setup(props, context) {
		provide('ElRadioGroup', { props, context })

		const elFormItem: Data = inject('elFormItem', {})

		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)
		const _elTag: ComputedRef = computed(() => 'div')
		const radioGroupSize: ComputedRef = computed(() => props.size || _elFormItemSize)

		return {
			_elFormItemSize,
			_elTag,
			radioGroupSize
		}
	}
})
</script>
