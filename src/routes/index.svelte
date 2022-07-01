<script lang="ts">
	import DropArea from '../lib/DropArea.svelte';
</script>

<main class="center-everything">
	<div class="header-container">
		<h1>Shrekify</h1>
		<div class="header-background" />
	</div>

	<DropArea />
</main>

<style>
	@font-face {
		font-family: 'Shrek';
		font-style: normal;
		font-weight: 400;
		src: url('../assets/shrek.woff2') format('woff2'), url('../assets/shrek.woff') format('woff');
	}

	main {
		font-family: 'Shrek';
		text-align: center;
		font-size: 26px;
	}

	.header-container {
		width: 100%;
		position: relative;
	}

	.header-background {
		background: #5b1717dd;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		border-bottom: 4px solid #5b1717;
	}

	h1 {
		text-align: center;
		font-size: 80px;
		background: linear-gradient(lime, green);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		padding: 0px 4px;
		margin: 30px 0;
	}

	.center-everything {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
