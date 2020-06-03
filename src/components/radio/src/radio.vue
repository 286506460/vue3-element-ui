<template>
	<label
		class="el-radio"
		:class="[
			border && radioSize ? 'el-radio--' + radioSize : '',
			{ 'is-disabled': isDisabled },
			{ 'is-focus': focus },
			{ 'is-bordered': border },
			{ 'is-checked': model === label }
		]"
		role="radio"
		:aria-checked="model === label"
		:aria-disabled="isDisabled"
		:tabindex="tabindex"
	>
		<span
			class="el-radio__input"
			:class="{
				'is-disabled': isDisabled,
				'is-checked': model === label
			}"
		>
			<span class="el-radio__inner"></span>
			<input
				ref="radio"
				class="el-radio__original"
				:value="label"
				type="radio"
				aria-hidden="true"
				v-model="model"
				@change.stop="handleChange"
				:name="name"
				tabindex="-1"
			/>
		</span>
		<span class="el-radio__label" @keydown.stop>
			<slot></slot>
			<template v-if="!$slots.default">{{ label }}</template>
		</span>
	</label>
</template>

<script lang="ts">
import { defineComponent, computed, ComputedRef, inject, ref } from 'vue'
export default defineComponent({
	name: 'ElRadio',
	props: {
		modelValue: {},
		label: {},
		disabled: Boolean,
		name: String,
		border: Boolean,
		size: String
	},
	setup(props, { emit }) {
		const focus = ref<boolean>(false)

		const elForm: Data = inject<Data>('elForm', {})
		const elFormItem: Data = inject<Data>('elFormItem', {})
		const parent: Data = inject<Data>('ElRadioGroup', {})

		const isGroup: ComputedRef = computed(() => Object.keys(parent).length !== 0)

		const model: ComputedRef = computed({
			get: () => (isGroup.value ? parent.props.modelValue : props.modelValue),
			set: val => {
				if (isGroup.value) {
					parent.context.emit('update:modelValue', val)
				} else {
					emit('update:modelValue', val)
				}
			}
		})

		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)

		const radioSize: ComputedRef = computed(() => {
			const temRadioSize = props.size || _elFormItemSize
			return isGroup.value ? parent.radioGroupSize || temRadioSize : temRadioSize
		})

		const isDisabled: ComputedRef = computed(() =>
			isGroup.value
				? parent.disabled || props.disabled || elForm.disabled
				: props.disabled || elForm.disabled
		)

		const tabindex: ComputedRef = computed(() =>
			isDisabled || (isGroup && model !== props.label) ? -1 : 0
		)

		const handleChange = (): void => {
			emit('change', model.value)
			isGroup.value && parent.context.emit('change', model.value)
		}

		return {
			focus,
			model,
			radioSize,
			isDisabled,
			tabindex,
			handleChange
		}
	}
})
</script>
