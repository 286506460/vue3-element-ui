<template>
	<li
		@mouseenter="hoverItem"
		@click.stop="selectOptionClick(value)"
		class="el-select-dropdown__item"
		v-show="visible"
		:class="{
			selected: itemSelected,
			'is-disabled': disabled || groupDisabled || limitReached,
			hover: hover
		}"
	>
		<slot>
			<span>{{ currentLabel }}</span>
		</slot>
	</li>
</template>

<script lang="ts">
import { defineComponent, inject, ref, ComputedRef, compile, computed, watch } from 'vue'
import { getValueByPath, escapeRegexpString } from '@/utils/util'

export default defineComponent({
	name: 'ElOption',
	componentName: 'ElOption',
	props: {
		value: {
			required: true
		},
		label: [String, Number],
		created: Boolean,
		disabled: {
			type: Boolean,
			default: false
		}
	},
	setup(props, context) {
		// data
		const index = ref<Number>(-1)
		const groupDisabled = ref<Boolean>(false)
		const visible = ref<Boolean>(true)
		const hitState = ref<Boolean>(false)
		const hover = ref<Boolean>(false)
		// inject
		const select: Data = inject<Data>('select', {})
		// computed
		const isObject: ComputedRef = computed(
			() => Object.prototype.toString.call(props.value).toLowerCase() === '[object object]'
		)
		const currentLabel: ComputedRef = computed(
			() => props.label || (isObject.value ? '' : props.value)
		)
		const currentValue: ComputedRef = computed(() => props.value || props.label || '')
		const itemSelected: ComputedRef = computed(() => {
			if (select.prop && !select.props.multiple) {
				return isEqual(props.value, select.value)
			} else {
				return contains(select.props.modelValue, props.value)
			}
		})
		const limitReached: ComputedRef = computed(() => {
			if (select.props.multiple) {
				return (
					!itemSelected.value &&
					(select.props.modelValue || []).length >= select.props.multipleLimit &&
					select.props.multipleLimit > 0
				)
			} else {
				return false
			}
		})
		// watch
		watch(currentLabel, (val, preVal) => {
			// if (!props.created && !select.props.remote) this.dispatch('ElSelect', 'setSelected')
		})
		const value: any = props.value

		// watch(value, (val, preVal) => {
		// 	console.log('********************')
		// 	console.log(val)
		// 	// const { remote, valueKey } = select.props
		// 	// if (!props.created && !remote) {
		// 	// 	if (
		// 	// 		valueKey &&
		// 	// 		typeof val === 'object' &&
		// 	// 		typeof preVal === 'object' &&
		// 	// 		val[valueKey] === preVal[valueKey]
		// 	// 	) {
		// 	// 		return
		// 	// 	}
		// 	// 	// this.dispatch('ElSelect', 'setSelected')
		// 	// }
		// })
		// methods
		const isEqual = (a: any, b: any) => {
			if (!isObject.value) {
				return a === b
			} else {
				const valueKey = select.prop && select.props.valueKey
				return getValueByPath(a, valueKey) === getValueByPath(b, valueKey)
			}
		}
		const contains = (arr: [] = [], target: any) => {
			if (!isObject.value) {
				return arr && arr.indexOf(target) > -1
			} else {
				const valueKey = select.props.valueKey
				return (
					arr &&
					arr.some(item => {
						return getValueByPath(item, valueKey) === getValueByPath(target, valueKey)
					})
				)
			}
		}
		const handleGroupDisabled = (val: Boolean): void => {
			groupDisabled.value = val
		}
		const hoverItem = (): void => {
			if (!props.disabled && !groupDisabled) {
				select.state.hoverIndex = select.state.options.indexOf(this)
			}
		}
		const selectOptionClick = (value: any): void => {
			if (props.disabled !== true && groupDisabled.value !== true) {
				//   this.dispatch('ElSelect', 'handleOptionClick', [this, true]);
				select.methods.handleOptionSelect(value)
			}
		}
		const queryChange = (query: any) => {
			visible.value =
				new RegExp(escapeRegexpString(query), 'i').test(currentLabel.value) ||
				(props.created as boolean)
			if (!visible.value) {
				select.state.filteredOptionsCount--
			}
		}
		// created
		select.state.options.push(context)
		select.state.cachedOptions.push({ value: props.value, currentLabel: props.label })
		select.state.optionsCount++
		select.state.filteredOptionsCount++

		// this.$on('queryChange', this.queryChange)
		// this.$on('handleGroupDisabled', this.handleGroupDisabled)
		return {
			hoverItem,
			selectOptionClick,
			visible,
			itemSelected,
			groupDisabled,
			limitReached,
			hover,
			currentLabel
		}
	}
})
</script>
