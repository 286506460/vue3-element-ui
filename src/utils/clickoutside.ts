// import * as Vue from 'vue'
import { on } from './dom'

const nodeList: any[] = []
const ctx = '@@clickoutsideContext'

let startClick: any
let seed = 0

on(document, 'mousedown', (e: any) => (startClick = e))

on(document, 'mouseup', (e: any) => {
	nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})

function createDocumentHandler(el: any, binding: any, vnode: any) {
	return function(mouseup: any = {}, mousedown: any = {}) {
		if (
			!vnode ||
			!mouseup.target ||
			!mousedown.target ||
			el.contains(mouseup.target) ||
			el.contains(mousedown.target) ||
			el === mouseup.target
		)
			return

		if (binding.expression && el[ctx].methodName && vnode.context[el[ctx].methodName]) {
			vnode.context[el[ctx].methodName]()
		} else {
			el[ctx].bindingFn && el[ctx].bindingFn()
		}
	}
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
	beforeMount(el: any, binding: any, vnode: any) {
		nodeList.push(el)
		const id = seed++
		el[ctx] = {
			id,
			documentHandler: createDocumentHandler(el, binding, vnode),
			methodName: binding.expression,
			bindingFn: binding.value
		}
	},
	updated(el: any, binding: any, vnode: any) {
		el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
		el[ctx].methodName = binding.expression
		el[ctx].bindingFn = binding.value
	},
	unmounted(el: any) {
		let len = nodeList.length
		for (let i = 0; i < len; i++) {
			if (nodeList[i][ctx].id === el[ctx].id) {
				nodeList.splice(i, 1)
				break
			}
		}
		delete el[ctx]
	}
}
