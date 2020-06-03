<template>
	<button
		class="el-button"
		:disabled="buttonDisabled || loading"
		:type="nativeType"
		:class="[
			type ? `el-button--${type}` : '',
			typeof buttonSize === 'string' ? `el-button--${buttonSize}` : '',
			{
				'is-disabled': buttonDisabled,
				'is-plain': plain,
				'is-round': round,
				'is-circle': circle
			}
		]"
	>
		<i class="el-icon-loading" v-if="loading"></i>
		<i :class="icon" v-if="icon && !loading"></i>
		<span v-if="slots.default">
			<slot></slot>
		</span>
	</button>
</template>

<script lang="ts">
import { defineComponent, computed, inject, ComputedRef } from 'vue'

export default defineComponent({
	name: 'ElButton',
	props: {
		type: {
			type: String,
			default: 'default'
		},
		size: String,
		icon: {
			type: String,
			default: ''
		},
		nativeType: {
			type: String,
			default: 'button'
		},
		loading: Boolean,
		disabled: Boolean,
		plain: Boolean,
		round: Boolean,
		circle: Boolean
	},
	setup(props: Data, { slots }) {
		// inject
		const elForm: Data = inject<Data>('elForm', {})
		const elFormItem: Data = inject<Data>('elFormItem', {})

		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)
		const buttonSize: ComputedRef = computed(() => props.size || _elFormItemSize)
		const buttonDisabled: ComputedRef = computed(() => props.disabled || elForm.disabled)

		return {
			buttonSize,
			buttonDisabled,
			slots
		}
	}
})
</script>
