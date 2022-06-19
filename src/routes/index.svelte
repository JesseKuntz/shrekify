<script lang="ts">
	import Dropzone from 'dropzone';
	import { onMount } from 'svelte';

	onMount(() => {
		let myDropzone = new Dropzone('div.drop-area', { url: '/shrekify' });
	});
</script>

<main class="center-everything">
	<h1>Shrekify</h1>
	<p>Upload a Face</p>
	<div class="drop-area center-everything" />
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

	h1 {
		text-align: center;
		font-size: 80px;
		background: linear-gradient(lime, green);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.center-everything {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.drop-area {
		padding: 60px;
		border: 4px dashed;
		border-radius: 8px;
	}
</style>
