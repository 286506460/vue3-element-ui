<template>
	<div class="slider">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-slider v-model="value1"></el-slider>
			{{ value1 }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRow from '@/components/row/src/row.ts'
import ElSlider from '@/components/slider/src/main.vue'

export default defineComponent({
	components: {
		ElRow,
		ElSlider
	},
	setup() {
		const value1 = ref<number>(0)
		return {
			value1
		}
	}
})
</script>
