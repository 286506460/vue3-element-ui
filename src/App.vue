<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">Home</router-link> |
			<router-link to="/button">Button</router-link> |
			<router-link to="/radio">Radio</router-link> |
			<router-link to="/checkbox">Checkbox</router-link> |
			<router-link to="/input">Input</router-link> |
			<router-link to="/about">About</router-link>
		</div>
		<router-view />
	</div>
</template>

<style lang="scss">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	// text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
	border-bottom: 1px solid #dcdcdc;

	a {
		font-weight: bold;
		color: #2c3e50;
		text-decoration: none;
		margin: 0 10px;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
