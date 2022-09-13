<script lang="ts">
	import DropArea from './lib/components/DropArea.svelte';
	import leftEar from './assets/left-ear.png';
	import rightEar from './assets/right-ear.png';
</script>

<main class="center-everything">
	<div class="header-container">
		<h1>Shrekify</h1>
		<div class="header-background" />
	</div>

	<DropArea />

	<!-- Image Processing Elements -->
	<div class="hide">
		<canvas class="shrekify-canvas" />
		<canvas class="image-processing-canvas" />
		<canvas class="buffer-canvas" />
		<img class="placeholder-image" src="" alt="" />
		<img class="left-ear" src={leftEar} alt="" />
		<img class="right-ear" src={rightEar} alt="" />
	</div>
</main>

<style>
	@font-face {
		font-family: 'Shrek';
		font-style: normal;
		font-weight: 400;
		src: url('./assets/shrek.woff2') format('woff2'), url('./assets/shrek.woff') format('woff');
	}

	main {
		font-family: 'Shrek';
		text-align: center;
		font-size: 26px;
	}

	.header-container {
		position: relative;
	}

	.header-background {
		background: #3f2a1f;
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		border-radius: 0 0 20px 20px;
	}

	h1 {
		text-align: center;
		font-size: 80px;
		background: linear-gradient(lime, green);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		margin: 0;
		padding: 20px 40px;
		z-index: 1;
		position: relative;
	}

	.center-everything {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.hide {
		display: none;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 60px;
			padding: 20px 20px;
		}
	}
</style>
