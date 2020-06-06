<template>
	<label
		ref="checkbox"
		class="el-checkbox"
		:class="[
			border && checkboxSize ? 'el-checkbox--' + checkboxSize : '',
			{ 'is-disabled': isDisabled },
			{ 'is-bordered': border },
			{ 'is-checked': isChecked }
		]"
		:id="id"
	>
		<span
			class="el-checkbox__input"
			:class="{
				'is-disabled': isDisabled,
				'is-checked': isChecked,
				'is-indeterminate': indeterminate,
				'is-focus': focus
			}"
			:tabindex="indeterminate ? 0 : false"
			:role="indeterminate ? 'checkbox' : false"
			:aria-checked="indeterminate ? 'mixed' : false"
		>
			<span class="el-checkbox__inner"></span>
			<input
				v-if="trueLabel || falseLabel"
				class="el-checkbox__original"
				type="checkbox"
				:aria-hidden="indeterminate ? 'true' : 'false'"
				:name="name"
				:disabled="disabled"
				:true-value="trueLabel"
				:false-value="falseLabel"
				v-model="model"
				@change="handleChange"
				@focus="focus = true"
				@blur="focus = false"
			/>
			<input
				v-else
				class="el-checkbox__original"
				type="checkbox"
				:aria-hidden="indeterminate ? 'true' : 'false'"
				:disabled="isDisabled"
				:value="label"
				:name="name"
				v-model="model"
				@change.stop="handleChange"
				@focus="focus = true"
				@blur="focus = false"
			/>
		</span>
		<span class="el-checkbox__label" v-if="$slots.default || label">
			<slot></slot>
			<template v-if="!$slots.default">{{ label }}</template>
		</span>
	</label>
</template>

<script lang="ts">
import { defineComponent, ref, inject, computed, ComputedRef, onMounted, Ref } from 'vue'

export default defineComponent({
	name: 'ElCheckbox',
	componentName: 'ElCheckbox',
	props: {
		modelValue: {},
		label: {},
		indeterminate: Boolean,
		disabled: Boolean,
		checked: Boolean,
		name: String,
		trueLabel: [String, Number],
		falseLabel: [String, Number],
		id: String,
		controls: String,
		border: Boolean,
		size: String
	},
	setup(props, { emit }) {
		const checkbox = ref<any>(null)

		const selfModel = ref<boolean>(false)
		const focus = ref<boolean>(false)
		const isLimitExceeded = ref<boolean>(false)

		const elForm: Data = inject<Data>('elForm', {})
		const elFormItem: Data = inject<Data>('elFormItem', {})
		const parent: Data = inject<Data>('ElCheckboxGroup', {})

		const isGroup: ComputedRef = computed(() => Object.keys(parent).length !== 0)
		const store: ComputedRef = computed(() =>
			isGroup.value ? parent.props.modelValue : props.modelValue
		)

		const model: Ref = computed({
			get: () =>
				isGroup.value
					? store.value
					: props.modelValue !== undefined
					? props.modelValue
					: selfModel,
			set: (val: any) => {
				if (isGroup.value) {
					isLimitExceeded.value = false
					parent.props.min !== undefined &&
						val.length < parent.props.min &&
						(isLimitExceeded.value = true)

					parent.props.max !== undefined &&
						val.length > parent.props.max &&
						(isLimitExceeded.value = true)

					isLimitExceeded.value === false && parent.context.emit('update:modelValue', val)
				} else {
					emit('update:modelValue', val)
					selfModel.value = val
				}
			}
		})

		const isChecked: ComputedRef = computed(() => {
			if ({}.toString.call(model.value) === '[object Boolean]') {
				return model.value
			} else if (Array.isArray(model.value)) {
				return model.value.indexOf(props.label) > -1
			} else if (model.value !== null && model.value !== undefined) {
				return model.value === props.trueLabel
			}
		})

		const isLimitDisabled: ComputedRef = computed(() => {
			const { max, min } = parent
			return (
				(!!(max || min) && model.value.length >= max && !isChecked.value) ||
				(model.value.length <= min && isChecked.value)
			)
		})
		const isDisabled: ComputedRef = computed(() => {
			return isGroup
				? parent.disabled || props.disabled || elForm.disabled || isLimitDisabled.value
				: props.disabled || elForm.disabled
		})
		const _elFormItemSize: ComputedRef = computed(() => elFormItem._elFormItemSize)
		const checkboxSize: ComputedRef = computed(() => {
			const temCheckboxSize = props.size || _elFormItemSize.value
			return isGroup ? parent.checkboxGroupSize || temCheckboxSize : temCheckboxSize
		})

		const addToStore = () => {
			if (Array.isArray(model.value) && model.value.indexOf(props.label) === -1) {
				model.value.push(props.label)
			} else {
				model.value = props.trueLabel || true
			}
		}
		const handleChange = (ev: any) => {
			if (isLimitDisabled.value) return
			let value
			if (ev.target.checked) {
				value = props.trueLabel === undefined ? true : props.trueLabel
			} else {
				value = props.falseLabel === undefined ? false : props.falseLabel
			}
			emit('change', value, ev)
			setTimeout(() => {
				if (isGroup.value) {
					parent.context.emit('change', parent.props.modelValue)
				}
			}, 0)
		}

		// created
		props.checked && addToStore()

		onMounted(() => {
			if (props.indeterminate) {
				checkbox.value.setAttribute('aria-controls', props.controls)
			}
		})

		return {
			checkbox,
			focus,
			model,
			isChecked,
			isDisabled,
			checkboxSize,
			handleChange,
			isLimitDisabled,
			isLimitExceeded
		}
	}
})
</script>
