/* eslint-disable */
import { ref, watch, reactive, nextTick, onBeforeUnmount, onDeactivated } from 'vue'
import { PopupManager } from './popup'

const PopperJS = require('./popper')
const stop = (e: any) => e.stopPropagation()

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
interface VuePopperMixins {
	popperElm: any
	$refs: any
	referenceElm: any
	_popper: any
	_reference: any
	$slots: any
	$emit: any
}

export default (
	emit: any,
	props: any,
	{ popperElm, $refs, referenceElm, _popper, _reference, $slots, $emit }: VuePopperMixins
) => {
	// props
	const transformOrigin = ref<boolean | string>(true)
	const placement = ref<string>('bottom')
	// const boundariesPadding = ref<number>(5)
	// const reference = reactive<any>({})
	// const popper = reactive<any>({})
	const offset = ref<number>(0)
	const value = ref<boolean>(false)
	const visibleArrow = ref<boolean>(false)
	const arrowOffset = ref<number>(35)
	const appendToBody = ref<boolean>(true)
	const popperOptions = reactive<any>({ gpuAcceleration: false })
	// Data
	const showPopper = ref<boolean>(false)
	const currentPlacement = ref<string>('')
	// watch
	watch(value, val => {
		showPopper.value = val
		emit('input', val)
	})

	watch(showPopper, val => {
		if (props.disabled) return
		val
			? updatePopper({
					popperElm,
					$refs,
					referenceElm,
					_popper,
					_reference,
					$slots,
					$emit
			  })
			: destroyPopper()
		emit('input', val)
	})

	let popperJS: any
	const appended = ref<boolean>(false)
	// methods
	const createPopper = ({
		popperElm,
		$refs,
		referenceElm,
		_popper,
		_reference,
		$slots,
		$emit
	}: VuePopperMixins) => {
		currentPlacement.value = currentPlacement.value || placement.value
		if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(currentPlacement.value)) {
			return
		}

		const options = popperOptions
		const popper = (popperElm = popperElm || _popper || $refs.popper)
		let reference = (referenceElm = referenceElm || _reference || $refs.reference)

		if (!reference && $slots.reference && $slots.reference[0]) {
			reference = referenceElm = $slots.reference[0].elm
		}

		if (!popper || !reference) return
		if (visibleArrow.value) appendArrow(popper)
		if (appendToBody.value) document.body.appendChild(popperElm)
		if (popperJS && popperJS.destroy) {
			popperJS.destroy()
		}

		options.placement = currentPlacement.value
		options.offset = offset.value
		options.arrowOffset = arrowOffset.value
		popperJS = new PopperJS(reference, popper, options)
		popperJS.onCreate((_: any) => {
			console.log(_)
			$emit('created', {})
			resetTransformOrigin()
			nextTick(
				updatePopper({
					popperElm,
					$refs,
					referenceElm,
					_popper,
					_reference,
					$slots,
					$emit
				})
			)
		})
		if (typeof options.onUpdate === 'function') {
			popperJS.onUpdate(options.onUpdate)
		}
		popperJS._popper.style.zIndex = PopupManager.nextZIndex()
		popperElm.addEventListener('click', stop)
	}

	const updatePopper = ({
		popperElm,
		$refs,
		referenceElm,
		_popper,
		_reference,
		$slots,
		$emit
	}: VuePopperMixins): any => {
		// const popperJS = this.popperJS
		if (popperJS) {
			popperJS.update()
			if (popperJS._popper) {
				popperJS._popper.style.zIndex = PopupManager.nextZIndex()
			}
		} else {
			createPopper({
				popperElm,
				$refs,
				referenceElm,
				_popper,
				_reference,
				$slots,
				$emit
			})
		}
	}

	const doDestroy = (forceDestroy: any) => {
		/* istanbul ignore if */
		if (!popperJS || (showPopper.value && !forceDestroy)) return
		popperJS.destroy()
		popperJS = null
	}

	const destroyPopper = () => {
		if (popperJS) {
			resetTransformOrigin()
		}
	}

	const resetTransformOrigin = () => {
		if (!transformOrigin.value) return
		const placementMap: any = {
			top: 'bottom',
			bottom: 'top',
			left: 'right',
			right: 'left'
		}
		const placement = popperJS._popper.getAttribute('x-placement').split('-')[0]
		const origin = placementMap[placement]
		popperJS._popper.style.transformOrigin =
			typeof transformOrigin.value === 'string'
				? transformOrigin.value
				: ['top', 'bottom'].indexOf(placement) > -1
				? `center ${origin}`
				: `${origin} center`
	}

	const appendArrow = (element: any) => {
		let hash
		if (appended.value) {
			return
		}

		appended.value = true

		for (const item in element.attributes) {
			if (/^_v-/.test(element.attributes[item].name)) {
				hash = element.attributes[item].name
				break
			}
		}

		const arrow = document.createElement('div')

		if (hash) {
			arrow.setAttribute(hash, '')
		}
		arrow.setAttribute('x-arrow', '')
		arrow.className = 'popper__arrow'
		element.appendChild(arrow)
	}

	onBeforeUnmount(() => {
		doDestroy(true)
		// if (popperElm && popperElm.parentNode === document.body) {
		// 	popperElm.removeEventListener('click', stop)
		// 	document.body.removeChild(popperElm)
		// }
	})

	onDeactivated(() => {
		// this.$options.beforeDestroy[0].call(this)
	})
}
