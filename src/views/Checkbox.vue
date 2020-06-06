<template>
	<div class="checkbox">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-checkbox v-model="checked">备选项</el-checkbox>
			{{ checked }}
		</el-row>
		<h3>禁用状态</h3>
		<el-row class="demo-row">
			<el-checkbox v-model="checked1" disabled>备选项1</el-checkbox>
			<el-checkbox v-model="checked2" disabled>备选项2</el-checkbox>
		</el-row>
		<h3>多选框组</h3>
		<el-row class="demo-row">
			<el-checkbox-group v-model="checkList">
				<el-checkbox label="复选框 A"></el-checkbox>
				<el-checkbox label="复选框 B"></el-checkbox>
				<el-checkbox label="复选框 C"></el-checkbox>
				<el-checkbox label="禁用" disabled></el-checkbox>
				<el-checkbox label="选中且禁用" disabled></el-checkbox>
			</el-checkbox-group>
			{{ checkList }}
		</el-row>
		<h3>indeterminate 状态</h3>
		<el-row class="demo-row">
			<el-checkbox
				:indeterminate="isIndeterminate"
				v-model="checkAll"
				@change="handleCheckAllChange"
				>全选</el-checkbox
			>
			<div style="margin: 15px 0;"></div>
			<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
				<el-checkbox v-for="city in cities" :label="city" :key="city">
					{{ city }}
				</el-checkbox>
			</el-checkbox-group>
			{{ checkedCities }}
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import ElRow from '@/components/row/src/row.ts'
import ElCheckbox from '@/components/checkbox/src/checkbox.vue'
import ElCheckboxGroup from '@/components/checkbox/src/checkbox-group.vue'

export default defineComponent({
	components: {
		ElRow,
		ElCheckbox,
		ElCheckboxGroup
	},
	setup() {
		const checked = ref<boolean>(true)
		const checked1 = ref<boolean>(false)
		const checked2 = ref<boolean>(true)
		const checkList = ref<Array<string>>(['选中且禁用', '复选框 A'])

		const checkAll = ref<boolean>(false)
		const checkedCities = ref<Array<string>>(['上海', '北京'])
		const cities = ref<Array<string>>(['上海', '北京', '广州', '深圳'])
		const isIndeterminate = ref<boolean>(true)

		const handleCheckAllChange = (val: boolean) => {
			checkedCities.value = val ? ['上海', '北京', '广州', '深圳'] : []
			isIndeterminate.value = false
		}
		const handleCheckedCitiesChange = (value: []) => {
			const checkedCount = value.length
			checkAll.value = checkedCount === cities.value.length
			isIndeterminate.value = checkedCount > 0 && checkedCount < cities.value.length
		}

		return {
			checked,
			checked1,
			checked2,
			checkList,
			checkAll,
			checkedCities,
			cities,
			isIndeterminate,
			handleCheckAllChange,
			handleCheckedCitiesChange
		}
	}
})
</script>
