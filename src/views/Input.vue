<template>
	<div class="input">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-input
				v-model="input"
				placeholder="请输入内容"
				prefix-icon="el-icon-search"
				maxlength="10"
				show-word-limit
			>
			</el-input>
			{{ input }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRow from '@/components/row/src/row.ts'
import ElInput from '@/components/input/src/input.vue'

export default defineComponent({
	components: {
		ElRow,
		ElInput
	},
	setup() {
		const input = ref('123')
		return {
			input
		}
	}
})
</script>
