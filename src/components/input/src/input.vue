<template>
	<div
		:class="[
			type === 'textarea' ? 'el-textarea' : 'el-input',
			inputSize ? 'el-input--' + inputSize : '',
			{
				'is-disabled': inputDisabled,
				'is-exceed': inputExceed,
				'el-input-group': $slots.prepend || $slots.append,
				'el-input-group--append': $slots.append,
				'el-input-group--prepend': $slots.prepend,
				'el-input--prefix': $slots.prefix || prefixIcon,
				'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
			}
		]"
		@mouseenter="hovering = true"
		@mouseleave="hovering = false"
	>
		<template v-if="type !== 'textarea'">
			<!-- 前置元素 -->
			<div class="el-input-group__prepend" v-if="$slots.prepend">
				<slot name="prepend"></slot>
			</div>
			<input
				:tabindex="tabindex"
				v-if="type !== 'textarea'"
				class="el-input__inner"
				v-bind="$attrs"
				:type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
				:disabled="inputDisabled"
				:readonly="readonly"
				ref="input"
				@input="handleInput"
				@focus="handleFocus"
				@blur="handleBlur"
				@change="handleChange"
				:aria-label="label"
			/>
			<!-- 前置内容 -->
			<span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
				<slot name="prefix"></slot>
				<i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"> </i>
			</span>
			<!-- 后置内容 -->
			<span class="el-input__suffix" v-if="getSuffixVisible()">
				<span class="el-input__suffix-inner">
					<template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
						<slot name="suffix"></slot>
						<i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"> </i>
					</template>
					<i
						v-if="showClear"
						class="el-input__icon el-icon-circle-close el-input__clear"
						@mousedown.prevent
						@click="clear"
					></i>
					<i
						v-if="showPwdVisible"
						class="el-input__icon el-icon-view el-input__clear"
						@click="handlePasswordVisible"
					></i>
					<span v-if="isWordLimitVisible" class="el-input__count">
						<span class="el-input__count-inner">
							{{ textLength }}/{{ upperLimit }}
						</span>
					</span>
				</span>
				<i
					class="el-input__icon"
					v-if="validateState"
					:class="['el-input__validateIcon', validateIcon]"
				>
				</i>
			</span>
			<!-- 后置元素 -->
			<div class="el-input-group__append" v-if="$slots.append">
				<slot name="append"></slot>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject, computed, ComputedRef, ref, Ref, onMounted, watch } from 'vue'

export default defineComponent({
	name: 'ElInput',
	componentName: 'ElInput',
	inheritAttrs: false,
	props: {
		modelValue: [String, Number],
		size: String,
		resize: String,
		form: String,
		disabled: Boolean,
		readonly: Boolean,
		type: {
			type: String,
			default: 'text'
		},
		autosize: {
			type: [Boolean, Object],
			default: false
		},
		autocomplete: {
			type: String,
			default: 'off'
		},
		validateEvent: {
			type: Boolean,
			default: true
		},
		suffixIcon: String,
		prefixIcon: String,
		label: String,
		clearable: {
			type: Boolean,
			default: false
		},
		showPassword: {
			type: Boolean,
			default: false
		},
		showWordLimit: {
			type: Boolean,
			default: false
		},
		tabindex: String
	},
	setup(props, { attrs, emit, slots }) {
		// const textareaCalcStyle = reactive({})
		const hovering: Ref = ref<boolean>(false)
		const focused: Ref = ref<boolean>(false)
		// const isComposing: Ref = ref<boolean>(false)
		// const passwordVisible: Ref = ref<boolean>(false)

		const elForm: Data = inject<Data>('elForm', {})
		const elFormItem: Data = inject<Data>('elFormItem', {})
		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)
		const inputSize: ComputedRef = computed(() => props.size || _elFormItemSize.value)
		const inputDisabled: ComputedRef = computed(() => props.disabled || elForm.disabled)

		const isWordLimitVisible: ComputedRef = computed(() => {
			return (
				props.showWordLimit &&
				attrs.maxlength &&
				(props.type === 'text' || props.type === 'textarea') &&
				!inputDisabled.value &&
				!props.readonly &&
				!props.showPassword
			)
		})
		const upperLimit: ComputedRef = computed(() => attrs.maxlength)
		const textLength: ComputedRef = computed(() => String(props.modelValue || '').length)
		const inputExceed: ComputedRef = computed(
			() => isWordLimitVisible.value && textLength.value > upperLimit.value
		)

		const handleInput = (event: any) => {
			emit('update:modelValue', event.target.value)
		}

		const handleFocus = (event: any): void => {
			focused.value = true
			emit('focus', event)
		}

		const handleBlur = (event: any): void => {
			focused.value = false
			emit('blur', event)
			// if (this.validateEvent) {
			//     this.dispatch('ElFormItem', 'el.form.blur', [this.value]);
			// }
		}

		const handleChange = (event: any): void => {
			emit('change', event.target.value)
		}

		const input = ref(null)
		const getInput = () => input.value

		const nativeInputValue: ComputedRef = computed(() =>
			props.modelValue === null || props.modelValue === undefined
				? ''
				: String(props.modelValue)
		)

		const setNativeInputValue = () => {
			const input = getInput()
			if (!input) return
			if (input.value === nativeInputValue.value) return
			input.value = nativeInputValue.value
		}

		const showClear: ComputedRef = computed(
			() =>
				props.clearable &&
				!inputDisabled.value &&
				!props.readonly &&
				nativeInputValue.value &&
				(focused.value || hovering.value)
		)

		const validateState: ComputedRef = computed(() =>
			elFormItem ? elFormItem.validateState : ''
		)
		const needStatusIcon: ComputedRef = computed(() => (elForm ? elForm.statusIcon : false))

		const getSuffixVisible = () =>
			slots.suffix ||
			props.suffixIcon ||
			showClear.value ||
			props.showPassword ||
			isWordLimitVisible.value ||
			(validateState.value && needStatusIcon.value)

		const showPwdVisible: ComputedRef = computed(
			() =>
				props.showPassword &&
				!inputDisabled.value &&
				!props.readonly &&
				(!!nativeInputValue.value || focused.value)
		)

		onMounted(() => {
			setNativeInputValue()
		})

		watch(nativeInputValue, () => {
			setNativeInputValue()
		})

		return {
			input,
			inputSize,
			inputDisabled,
			inputExceed,
			handleInput,
			handleFocus,
			handleBlur,
			handleChange,
			getSuffixVisible,
			showClear,
			showPwdVisible,
			isWordLimitVisible,
			upperLimit,
			textLength,
			validateState
		}
	}
})
</script>
