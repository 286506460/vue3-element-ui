export default {
	name: 'ElMarker',

	props: {
		mark: {
			type: [String, Object]
		}
	},
	render() {
		const label =
			typeof this.props.mark === 'string' ? this.props.mark : (this.props.mark as any).label

		return (
			<div class="el-slider__marks-text" style={(this.props.mark as any).style || {}}>
				{label}
			</div>
		)
	}
}
