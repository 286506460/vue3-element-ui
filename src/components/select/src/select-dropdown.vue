<template>
	<div
		ref="$el"
		class="el-select-dropdown el-popper"
		:class="[{ 'is-multiple': elSelect.props.multiple }, popperClass]"
		:style="{ minWidth: minWidth }"
	>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, ComputedRef, computed, inject, watch, onMounted } from 'vue'
// import Popper from '@/utils/vue-popper'

export default defineComponent({
	name: 'ElSelectDropdown',

	componentName: 'ElSelectDropdown',

	props: {
		placement: {
			default: 'bottom-start'
		},
		boundariesPadding: {
			default: 0
		},
		popperOptions: {
			default() {
				return {
					gpuAcceleration: false
				}
			}
		},
		visibleArrow: {
			default: true
		},
		appendToBody: {
			type: Boolean,
			default: true
		}
	},
	setup() {
		// const $el = ref<any>(null)

		const minWidth = ref<string>('')

		const elSelect: Data = inject<Data>('select', {})

		const popperClass: ComputedRef = computed(() => elSelect.props.popperClass)

		watch(elSelect.state.inputWidth, () => {
			minWidth.value = elSelect.state.inputWidth.value + 'px'
		})

		onMounted(() => {
			// const referenceElm = elSelect.$el
			// this.$parent.popperElm = this.popperElm = $el
			// this.$on('updatePopper', () => {
			// 	if (this.$parent.visible) this.updatePopper()
			// })
			// this.$on('destroyPopper', this.destroyPopper)
		})

		return {
			popperClass,
			minWidth,
			elSelect
		}
	}
})
</script>
