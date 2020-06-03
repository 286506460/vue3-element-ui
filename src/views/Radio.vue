<template>
	<div class="button">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-radio v-model="radio1" label="1">备选项</el-radio>
			<el-radio v-model="radio1" label="2">备选项</el-radio>
			{{ radio1 }}
		</el-row>
		<h3>禁用状态</h3>
		<el-row class="demo-row">
			<el-radio disabled v-model="radio2" label="禁用">备选项</el-radio>
			<el-radio disabled v-model="radio2" label="选中且禁用">备选项</el-radio>
		</el-row>
		<h3>单选框组</h3>
		<el-row class="demo-row">
			<el-radio-group v-model="radio3">
				<el-radio :label="3">备选项</el-radio>
				<el-radio :label="6">备选项</el-radio>
				<el-radio :label="9">备选项</el-radio>
			</el-radio-group>
			{{ radio3 }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRadio from '@/components/radio/src/radio.vue'
import ElRadioGroup from '@/components/radio/src/radio-group.vue'
import ElRow from '@/components/row/src/row.ts'

export default defineComponent({
	components: {
		ElRadio,
		ElRadioGroup,
		ElRow
	},
	setup() {
		const radio1 = ref('1')
		const radio2 = ref('选中且禁用')
		const radio3 = ref(3)
		return { radio1, radio2, radio3 }
	}
})
</script>
