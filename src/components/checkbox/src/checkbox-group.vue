<template>
	<div class="el-checkbox-group" role="group" aria-label="checkbox-group">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef, provide } from 'vue'

export default defineComponent({
	name: 'ElCheckboxGroup',
	componentName: 'ElCheckboxGroup',
	props: {
		modelValue: {},
		disabled: Boolean,
		min: Number,
		max: Number,
		size: String,
		fill: String,
		textColor: String
	},
	setup(props, context) {
		const elFormItem: Data = inject<Data>('elFormItem', { props, context })

		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)
		const checkboxGroupSize: ComputedRef = computed(() => props.size || _elFormItemSize.value)

		provide('ElCheckboxGroup', { props, context, checkboxGroupSize })
		return {
			_elFormItemSize,
			checkboxGroupSize
		}
	}
})
</script>
