<template>
	<div class="button">
		<h3>基础用法</h3>
		<el-row class="demo-row">
			<el-button>默认按钮</el-button>
			<el-button type="primary">主要按钮</el-button>
			<el-button type="success">成功按钮</el-button>
			<el-button type="info">信息按钮</el-button>
			<el-button type="warning">警告按钮</el-button>
			<el-button type="danger">危险按钮</el-button>
		</el-row>
		<el-row class="demo-row">
			<el-button plain>朴素按钮</el-button>
			<el-button type="primary" plain>主要按钮</el-button>
			<el-button type="success" plain>成功按钮</el-button>
			<el-button type="info" plain>信息按钮</el-button>
			<el-button type="warning" plain>警告按钮</el-button>
			<el-button type="danger" plain>危险按钮</el-button>
		</el-row>
		<el-row class="demo-row">
			<el-button round>圆角按钮</el-button>
			<el-button type="primary" round>主要按钮</el-button>
			<el-button type="success" round>成功按钮</el-button>
			<el-button type="info" round>信息按钮</el-button>
			<el-button type="warning" round>警告按钮</el-button>
			<el-button type="danger" round>危险按钮</el-button>
		</el-row>
		<el-row class="demo-row">
			<el-button icon="el-icon-search" circle></el-button>
			<el-button type="primary" icon="el-icon-edit" circle></el-button>
			<el-button type="success" icon="el-icon-check" circle></el-button>
			<el-button type="info" icon="el-icon-message" circle></el-button>
			<el-button type="warning" icon="el-icon-star-off" circle></el-button>
			<el-button type="danger" icon="el-icon-delete" circle></el-button>
		</el-row>
		<h3>不同尺寸</h3>
		<el-row class="demo-row">
			<el-button>默认按钮</el-button>
			<el-button size="medium">中等按钮</el-button>
			<el-button size="small">小型按钮</el-button>
			<el-button size="mini">超小按钮</el-button>
		</el-row>
		<h3>禁用状态</h3>
		<el-row class="demo-row">
			<el-button disabled>默认按钮</el-button>
			<el-button type="primary" disabled>主要按钮</el-button>
			<el-button type="success" disabled>成功按钮</el-button>
			<el-button type="info" disabled>信息按钮</el-button>
			<el-button type="warning" disabled>警告按钮</el-button>
			<el-button type="danger" disabled>危险按钮</el-button>
		</el-row>
		<h3>加载中</h3>
		<el-row class="demo-row">
			<el-button type="primary" :loading="true">加载中</el-button>
		</el-row>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ElButton from '@/components/button/src/button.vue'
import ElRow from '@/components/row/src/row.ts'

export default defineComponent({
	components: {
		ElButton,
		ElRow
	}
})
</script>
