import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<any> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/button',
		name: 'Button',
		component: () => import(/* webpackChunkName: "button" */ '../views/Button.vue')
	},
	{
		path: '/radio',
		name: 'Radio',
		component: () => import(/* webpackChunkName: "radio" */ '../views/Radio.vue')
	},
	{
		path: '/checkbox',
		name: 'Checkbox',
		component: () => import(/* webpackChunkName: "checkbox" */ '../views/Checkbox.vue')
	},
	{
		path: '/input',
		name: 'Input',
		component: () => import(/* webpackChunkName: "input" */ '../views/Input.vue')
	},
	{
		path: '/select',
		name: 'Select',
		component: () => import(/* webpackChunkName: "select" */ '../views/Select.vue')
	},
	{
		path: '/switch',
		name: 'Switch',
		component: () => import(/* webpackChunkName: "switch" */ '../views/Switch.vue')
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})

export default router
