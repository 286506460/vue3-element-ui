<template>
	<div
		class="el-select"
		:class="[selectSize ? 'el-select--' + selectSize : '']"
		@click.stop="toggleMenu"
		v-clickoutside="handleClose"
	>
		<el-input
			ref="reference"
			v-model="selectedLabel"
			type="text"
			:placeholder="currentPlaceholder"
			:name="name"
			:id="id"
			:size="selectSize"
			:disabled="selectDisabled"
			:readonly="readonly"
			:validate-event="false"
			:class="{ 'is-focus': visible }"
			:tabindex="multiple && filterable ? '-1' : null"
		>
			<template v-slot:prefix v-if="$slots.prefix">
				<slot name="prefix"></slot>
			</template>
			<template v-slot:suffix>
				<i
					v-show="!showClose"
					:class="['el-select__caret', 'el-input__icon', 'el-icon-' + iconClass]"
				></i>
				<i
					v-if="showClose"
					class="el-select__caret el-input__icon el-icon-circle-close"
					@click="handleClearClick"
				></i>
			</template>
		</el-input>
		<transition name="el-zoom-in-top">
			<el-select-menu
				ref="popper"
				:append-to-body="popperAppendToBody"
				v-show="visible && emptyText !== false"
			>
				<slot></slot>
			</el-select-menu>
		</transition>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	inject,
	provide,
	ComputedRef,
	computed,
	ref,
	nextTick,
	onMounted,
	reactive,
	watch,
	toRefs
} from 'vue'
import ElInput from '@/components/input/src/input.vue'
import ElSelectMenu from './select-dropdown.vue'
import Clickoutside from '@/utils/clickoutside.ts'
import { getValueByPath } from '@/utils/util.ts'

export default defineComponent({
	name: 'ElSelect',
	componentName: 'ElSelect',
	components: {
		ElInput,
		ElSelectMenu
	},
	directives: {
		Clickoutside
	},
	props: {
		name: String,
		id: String,
		modelValue: {
			required: true
		},
		autocomplete: {
			type: String,
			default: 'off'
		},
		automaticDropdown: Boolean,
		size: String,
		disabled: Boolean,
		clearable: Boolean,
		filterable: Boolean,
		allowCreate: Boolean,
		loading: Boolean,
		popperClass: String,
		remote: Boolean,
		loadingText: String,
		noMatchText: String,
		noDataText: String,
		remoteMethod: Function,
		filterMethod: Function,
		multiple: Boolean,
		multipleLimit: {
			type: Number,
			default: 0
		},
		placeholder: {
			type: String,
			default: ''
		},
		defaultFirstOption: Boolean,
		reserveKeyword: Boolean,
		valueKey: {
			type: String,
			default: 'value'
		},
		collapseTags: Boolean,
		popperAppendToBody: {
			type: Boolean,
			default: true
		}
	},
	setup(props, context) {
		console.log(context)
		// Dom
		const reference = ref<any>(null)
		// data
		const options = reactive<Array<any>>([])
		const cachedOptions = reactive<Array<any>>([])
		const createdLabel = ref(null)
		const createdSelected = ref<boolean>(false)
		const selected = ref<[] | {}>(props.multiple ? [] : {})
		const inputLength = ref<number>(20)
		const inputWidth = ref<number>(0)
		const initialInputHeight = ref<number>(0)
		// const cachedPlaceHolder = ref<string>('')
		// const optionsCount = ref<number>(0)
		const filteredOptionsCount = ref<number>(0)
		const visible = ref<boolean>(false)
		const softFocus = ref<boolean>(false)
		const selectedLabel = ref<string>('')
		// const hoverIndex = ref<number>(-1)
		const query = ref<string>('')
		// const previousQuery = ref<any>(null)
		const inputHovering = ref<boolean>(false)
		const currentPlaceholder = ref<string>('')
		const menuVisibleOnFocus = ref<boolean>(false)
		// const isOnComposition = ref<boolean>(false)
		// const isSilentBlur = ref<boolean>(false)
		// inject
		const elForm: Data = inject<Data>('elForm', {})
		const elFormItem: Data = inject<Data>('elFormItem', {})

		const getOption = (value: any) => {
			let option
			const isObject =
				Object.prototype.toString.call(value).toLowerCase() === '[object object]'
			const isNull = Object.prototype.toString.call(value).toLowerCase() === '[object null]'
			const isUndefined =
				Object.prototype.toString.call(value).toLowerCase() === '[object undefined]'

			for (let i = cachedOptions.length - 1; i >= 0; i--) {
				const cachedOption = cachedOptions[i]
				const isEqual = isObject
					? getValueByPath(cachedOption.value, props.valueKey) ===
					  getValueByPath(value, props.valueKey)
					: cachedOption.value === value
				if (isEqual) {
					option = cachedOption
					break
				}
			}
			if (option) return option
			const label = !isObject && !isNull && !isUndefined ? value : ''
			const newOption = {
				value: value,
				currentLabel: label
			}
			if (props.multiple) {
				// newOption.hitState = false
			}
			return newOption
		}
		const setSelected = () => {
			if (!props.multiple) {
				const option: any = getOption(props.modelValue)
				if (option.created) {
					createdLabel.value = option.currentLabel
					createdSelected.value = true
				} else {
					createdSelected.value = false
				}
				selectedLabel.value = option.currentLabel
				selected.value = option
				if (props.filterable) query.value = selectedLabel.value
				return
			}
			// let result = []
			// if (Array.isArray(this.value)) {
			// 	this.value.forEach(value => {
			// 		result.push(this.getOption(value))
			// 	})
			// }
			// this.selected = result
			// this.$nextTick(() => {
			// 	this.resetInputHeight()
			// })
		}

		// watch
		const { modelValue } = toRefs(props)
		watch(modelValue, (val: any, oldVal: any) => {
			console.log(val)
			console.log(oldVal)
			if (props.multiple) {
				// this.resetInputHeight()
				// if ((val && val.length > 0) || (this.$refs.input && this.query !== '')) {
				// 	this.currentPlaceholder = ''
				// } else {
				// 	this.currentPlaceholder = this.cachedPlaceHolder
				// }
				// if (this.filterable && !this.reserveKeyword) {
				// 	this.query = ''
				// 	this.handleQueryChange(this.query)
				// }
			}
			setSelected()
			if (props.filterable && !props.multiple) {
				inputLength.value = 20
			}
			// if (!valueEquals(val, oldVal)) {
			// 	this.dispatch('ElFormItem', 'el.form.change', val)
			// }
		})
		// computed
		const _elFormItemSize: ComputedRef = computed(() => elFormItem.elFormItemSize)
		const selectSize: ComputedRef = computed(() => props.size || _elFormItemSize.value)
		const selectDisabled: ComputedRef = computed(
			() => props.disabled || (elForm.props && elForm.props.disabled)
		)
		const readonly: ComputedRef = computed(
			() => !props.filterable || props.multiple || !visible.value
		)
		const showClose: ComputedRef = computed(() => {
			const hasValue = props.multiple
				? Array.isArray(props.modelValue) && props.modelValue.length > 0
				: props.modelValue !== undefined &&
				  props.modelValue !== null &&
				  props.modelValue !== ''
			const criteria =
				props.clearable && !selectDisabled.value && inputHovering.value && hasValue
			return criteria
		})
		const emptyText = computed(() => {
			if (props.loading) {
				return props.loadingText
			} else {
				if (props.remote && query.value === '' && options.length === 0) return false
				if (
					props.filterable &&
					query.value &&
					options.length > 0 &&
					filteredOptionsCount.value === 0
				) {
					return props.noMatchText
				}
				if (options.length === 0) {
					return props.noDataText
				}
			}
			return null
		})
		// methods
		const toggleMenu = () => {
			if (!selectDisabled.value) {
				if (menuVisibleOnFocus.value) {
					menuVisibleOnFocus.value = false
				} else {
					visible.value = !visible.value
				}
				if (visible.value) {
					// (this.$refs.input || this.$refs.reference).focus()
				}
			}
		}
		const handleClose = () => {
			console.log(123)
			visible.value = false
		}
		const handleFocus = (event: any) => {
			console.log(1)
			if (!softFocus.value) {
				if (props.automaticDropdown || props.filterable) {
					visible.value = true
					if (props.filterable) {
						menuVisibleOnFocus.value = true
					}
				}
				context.emit('focus', event)
			} else {
				softFocus.value = false
			}
		}
		const handleOptionSelect = (value: any) => {
			if (props.multiple) {
				// const value = (this.value || []).slice()
				// const optionIndex = this.getValueIndex(value, option.value)
				// if (optionIndex > -1) {
				// 	value.splice(optionIndex, 1)
				// } else if (this.multipleLimit <= 0 || value.length < this.multipleLimit) {
				// 	value.push(option.value)
				// }
				// this.$emit('input', value)
				// this.emitChange(value)
				// if (option.created) {
				// 	this.query = ''
				// 	this.handleQueryChange('')
				// 	this.inputLength = 20
				// }
				// if (this.filterable) this.$refs.input.focus()
			} else {
				context.emit('update:modelValue', value)
				// this.emitChange(option.value)
				visible.value = false
			}
			// this.isSilentBlur = byClick
			// this.setSoftFocus()
			if (visible.value) return
			nextTick(() => {
				// this.scrollToOption(option)
			})
		}

		onMounted(() => {
			if (props.multiple && Array.isArray(props.modelValue) && props.modelValue.length > 0) {
				currentPlaceholder.value = ''
			}
			// addResizeListener(this.$el, this.handleResize)

			// const reference = this.$refs.reference
			if (reference.value && reference.value.input) {
				const sizeMap: any = {
					medium: 36,
					small: 32,
					mini: 28
				}
				// const input = reference.value.input.querySelector('input')
				const input = reference.value.input
				initialInputHeight.value =
					input.getBoundingClientRect().height || sizeMap[selectSize.value]
			}
			if (props.remote && props.multiple) {
				// resetInputHeight()
			}
			nextTick(() => {
				if (reference.value) {
					inputWidth.value = reference.value.input.getBoundingClientRect().width
				}
			})
			setSelected()
		})

		// provide
		provide('select', {
			props,
			context,
			state: { inputWidth, options, cachedOptions },
			methods: { handleOptionSelect }
		})

		return {
			reference,
			selectedLabel,
			currentPlaceholder,
			selectSize,
			toggleMenu,
			handleClose,
			selectDisabled,
			readonly,
			visible,
			showClose,
			emptyText,
			handleFocus
		}
	}
})
</script>
