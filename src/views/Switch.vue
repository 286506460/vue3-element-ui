<template>
	<div class="select">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
			{{ value }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRow from '@/components/row/src/row.ts'
import ElSwitch from '@/components/switch/src/switch.vue'

export default defineComponent({
	components: {
		ElRow,
		ElSwitch
	},
	setup() {
		const value = ref<boolean>(true)
		return {
			value
		}
	}
})
</script>
