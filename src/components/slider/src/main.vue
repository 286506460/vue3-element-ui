<template>
	<div
		class="el-slider"
		:class="{ 'is-vertical': vertical, 'el-slider--with-input': showInput }"
		role="slider"
		:aria-valuemin="min"
		:aria-valuemax="max"
		:aria-orientation="vertical ? 'vertical' : 'horizontal'"
		:aria-disabled="sliderDisabled"
	>
		<div
			class="el-slider__runway"
			:class="{ 'show-input': showInput, disabled: sliderDisabled }"
			:style="runwayStyle"
			@click="onSliderClick"
			ref="slider"
		>
			<div class="el-slider__bar" :style="barStyle"></div>
			<slider-button
				:vertical="vertical"
				v-model="firstValue"
				:tooltip-class="tooltipClass"
				ref="button1"
			>
			</slider-button>
			<slider-button
				:vertical="vertical"
				v-model="secondValue"
				:tooltip-class="tooltipClass"
				ref="button2"
				v-if="range"
			>
			</slider-button>
		</div>
	</div>
</template>

<script lang="ts">
import {
	defineComponent,
	computed,
	ComputedRef,
	inject,
	ref,
	nextTick,
	onMounted,
	watch,
	toRefs
} from 'vue'
import SliderButton from './button.vue'
import { EventPlugin } from 'vue-next-event-plugin'

export default defineComponent({
	name: 'ElSlider',
	components: {
		SliderButton
	},
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		modelValue: {
			type: [Number, Array],
			default: 0
		},
		showInput: {
			type: Boolean,
			default: false
		},
		showInputControls: {
			type: Boolean,
			default: true
		},
		inputSize: {
			type: String,
			default: 'small'
		},
		showStops: {
			type: Boolean,
			default: false
		},
		showTooltip: {
			type: Boolean,
			default: true
		},
		formatTooltip: Function,
		disabled: {
			type: Boolean,
			default: false
		},
		range: {
			type: Boolean,
			default: false
		},
		vertical: {
			type: Boolean,
			default: false
		},
		height: {
			type: String
		},
		debounce: {
			type: Number,
			default: 300
		},
		label: {
			type: String
		},
		tooltipClass: String,
		marks: Object
	},
	setup(props, { emit }) {
		const $event = inject<EventPlugin>('$event', {} as EventPlugin)
		// ref
		const slider = ref<any>(null)
		const button1 = ref<any>(null)
		// data
		const dragging = ref<boolean>(false)
		const sliderSize = ref<number>(1)
		const firstValue = ref<number>(0)
		const secondValue = ref<number>(0)
		const oldValue = ref<any>(null)
		// inject
		const elForm: Data = inject<Data>('elForm', {})
		// computed
		const sliderDisabled: ComputedRef = computed(
			() => props.disabled || (elForm.props && elForm.props.disabled)
		)
		const runwayStyle: ComputedRef = computed(() =>
			props.vertical ? { height: props.height } : {}
		)
		const minValue: ComputedRef = computed(() => Math.min(firstValue.value, secondValue.value))
		const maxValue: ComputedRef = computed(() => Math.max(firstValue.value, secondValue.value))
		const barSize: ComputedRef = computed(() =>
			props.range
				? `${(100 * (maxValue.value - minValue.value)) / (props.max - props.min)}%`
				: `${(100 * (firstValue.value - props.min)) / (props.max - props.min)}%`
		)

		const barStart: ComputedRef = computed(() =>
			props.range
				? `${(100 * (minValue.value - props.min)) / (props.max - props.min)}%`
				: '0%'
		)
		const barStyle: ComputedRef = computed(() =>
			props.vertical
				? {
						height: barSize.value,
						bottom: barStart.value
				  }
				: {
						width: barSize.value,
						left: barStart.value
				  }
		)
		// method
		const resetSize = () => {
			if (slider.value) {
				sliderSize.value = slider.value[`client${props.vertical ? 'Height' : 'Width'}`]
			}
		}
		const setPosition = (percent: number) => {
			const targetValue = props.min + (percent * (props.max - props.min)) / 100
			if (!props.range) {
				// button1.value.setPosition(percent)
				$event.emit('setPosition', percent)
				return
			}
			let button
			if (Math.abs(minValue.value - targetValue) < Math.abs(maxValue.value - targetValue)) {
				button = firstValue.value < secondValue.value ? 'button1' : 'button2'
			} else {
				button = firstValue.value > secondValue.value ? 'button1' : 'button2'
			}
			slider.value.slider[button].setPosition(percent)
		}
		const emitChange = () => {
			nextTick(() => {
				emit('change', props.range ? [minValue.value, maxValue.value] : props.modelValue)
			})
		}
		const onSliderClick = event => {
			if (sliderDisabled.value || dragging.value) return
			resetSize()
			if (props.vertical) {
				const sliderOffsetBottom = slider.value.getBoundingClientRect().bottom
				setPosition(((sliderOffsetBottom - event.clientY) / sliderSize.value) * 100)
			} else {
				const sliderOffsetLeft = slider.value.getBoundingClientRect().left
				setPosition(((event.clientX - sliderOffsetLeft) / sliderSize.value) * 100)
			}
			emitChange()
		}
		const valueChanged = () => {
			if (props.range) {
				return ![minValue.value, maxValue.value].every(
					(item, index) => item === oldValue.value[index]
				)
			} else {
				return props.modelValue !== oldValue.value
			}
		}
		const setValues = () => {
			if (props.min > props.max) {
				console.error('[Element Error][Slider]min should not be greater than max.')
				return
			}
			const val: number | any[] = props.modelValue
			if (props.range && Array.isArray(val)) {
				if (val[1] < props.min) {
					emit('update:modelValue', [props.min, props.min])
				} else if (val[0] > props.max) {
					emit('update:modelValue', [props.max, props.max])
				} else if (val[0] < props.min) {
					emit('update:modelValue', [props.min, val[1]])
				} else if (val[1] > props.max) {
					emit('update:modelValue', [val[0], props.max])
				} else {
					firstValue.value = val[0]
					secondValue.value = val[1]
					if (valueChanged()) {
						// this.dispatch('ElFormItem', 'el.form.change', [
						// 	this.minValue,
						// 	this.maxValue
						// ])
						oldValue.value = val.slice()
					}
				}
			} else if (!props.range && typeof val === 'number' && !isNaN(val)) {
				if (val < props.min) {
					emit('update:modelValue', props.min)
				} else if (val > props.max) {
					emit('update:modelValue', props.max)
				} else {
					firstValue.value = val
					if (valueChanged()) {
						// this.dispatch('ElFormItem', 'el.form.change', val)
						oldValue.value = val
					}
				}
			}
		}
		// watch
		const { modelValue } = toRefs(props)
		watch(modelValue, (val, oldVal) => {
			if (
				dragging.value ||
				(Array.isArray(val) &&
					Array.isArray(oldVal) &&
					val.every((item, index) => item === oldVal[index]))
			) {
				return
			}
			setValues()
		})
		watch(dragging, val => {
			if (!val) {
				setValues()
			}
		})
		watch(firstValue, val => {
			if (props.range) {
				emit('update:modelValue', [minValue.value, maxValue.value])
			} else {
				emit('update:modelValue', val)
			}
		})
		watch(secondValue, () => {
			if (props.range) {
				emit('update:modelValue', [minValue.value, maxValue.value])
			}
		})

		onMounted(() => {
			// let valuetext
			if (props.range) {
				if (Array.isArray(props.modelValue)) {
					firstValue.value = Math.max(props.min, props.modelValue[0])
					secondValue.value = Math.min(props.max, props.modelValue[1])
				} else {
					firstValue.value = props.min
					secondValue.value = props.max
				}
				oldValue.value = [firstValue.value, secondValue.value]
				// valuetext = `${firstValue.value}-${secondValue.value}`
			} else {
				if (typeof props.modelValue !== 'number' || isNaN(props.modelValue)) {
					firstValue.value = props.min
				} else {
					firstValue.value = Math.min(props.max, Math.max(props.min, props.modelValue))
				}
				oldValue.value = firstValue.value
				// valuetext = firstValue.value
			}
			// this.$el.setAttribute('aria-valuetext', valuetext)

			// label screen reader
			// this.$el.setAttribute(
			// 	'aria-label',
			// 	this.label ? this.label : `slider between ${this.min} and ${this.max}`
			// )

			resetSize()
			window.addEventListener('resize', resetSize)
		})
		return {
			sliderDisabled,
			runwayStyle,
			slider,
			onSliderClick,
			barStyle,
			firstValue,
			secondValue,
			resetSize,
			emitChange,
			button1
		}
	}
})
</script>
