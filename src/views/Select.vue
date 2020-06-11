<template>
	<div class="select">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-select v-model="value" placeholder="请选择">
				<el-option
					v-for="item in options"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				>
				</el-option>
			</el-select>
			{{ value }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRow from '@/components/row/src/row.ts'
import ElSelect from '@/components/select/src/select.vue'
import ElOption from '@/components/select/src/option.vue'

export default defineComponent({
	components: {
		ElRow,
		ElSelect,
		ElOption
	},
	setup() {
		const value = ref<string>('选项1')
		const options = ref([
			{
				value: '选项1',
				label: '黄金糕'
			},
			{
				value: '选项2',
				label: '双皮奶'
			},
			{
				value: '选项3',
				label: '蚵仔煎'
			},
			{
				value: '选项4',
				label: '龙须面'
			},
			{
				value: '选项5',
				label: '北京烤鸭'
			}
		])
		return {
			value,
			options
		}
	}
})
</script>
