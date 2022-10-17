<script lang="ts">
	import { onMount } from 'svelte';

	let dragging = false;
	let dropped = false;
	let loading = false;
	let error = false;
	let file: File | null;
	let shrekifiedImage = '';
	let dropArea: HTMLElement | null;
	let form: HTMLFormElement;
	let previewImage: HTMLImageElement;

	const SUPPORTED_TYPES = ['image/png', 'image/jpeg'];

	function readFile(file: File, callback: (data: string) => void) {
		const reader = new FileReader();

		reader.onloadend = () => {
			callback(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	function uploadFile(file: File) {
		readFile(file, async (src) => {
			error = false;
			loading = true;

			const rawResponse = await fetch(
				'https://oi3wzjer82.execute-api.us-east-2.amazonaws.com/default/shrekify',
				{
					method: 'POST',
					body: JSON.stringify({
						file: src
					})
				}
			);

			console.log(rawResponse);

			if (rawResponse.ok) {
				const response = await rawResponse.json();

				previewImage.src = response.image;
				shrekifiedImage = response.image;
			} else {
				error = true;
			}

			loading = false;
		});
	}

	function handleDrop(e: DragEvent) {
		const dt = e.dataTransfer;

		if (dt) {
			handleFiles(dt.files);
		}
	}

	function handleInputChange(e: Event) {
		const target = e.target as HTMLInputElement;

		if (target.files) {
			handleFiles(target.files);
		}
	}

	function handleFiles(files: FileList) {
		const firstFile = files[0];

		if (SUPPORTED_TYPES.includes(firstFile.type)) {
			previewFile(firstFile);

			file = firstFile;
		}
	}

	function previewFile(file: File) {
		readFile(file, (src) => {
			previewImage.src = src;

			dropped = true;
		});
	}

	function clearFile() {
		file = null;
		dropped = false;
		error = false;
		shrekifiedImage = '';
		previewImage.src = '';
		form.reset();
	}

	function downloadImage() {
		var a = document.createElement('a');
		a.href = shrekifiedImage;
		a.download = 'shrekified.png';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	function preventDefaults(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}

	function initializeDropArea() {
		dropArea = document.querySelector('.drop-area');

		if (dropArea) {
			['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, preventDefaults, false);
			});
			['dragenter', 'dragover'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, () => (dragging = true), false);
			});
			['dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, () => (dragging = false), false);
			});

			dropArea.addEventListener('drop', handleDrop, false);
		}
	}

	onMount(() => initializeDropArea());
</script>

<div class="container center-everything">
	<div class:hide={!dropped} class="button-container">
		<button class="button shrekify-button" on:click={() => file && uploadFile(file)}
			>Shrekify</button
		>
		<button class="button clear-button" on:click={clearFile}>Start Over</button>
		<button class="button" class:hide={!shrekifiedImage} on:click={downloadImage}>Download</button>
	</div>

	<div class="drop-area" class:highlight={dragging} class:hide={dropped}>
		<form bind:this={form} class="my-form">
			<input
				type="file"
				id="file-input"
				accept={SUPPORTED_TYPES.join(',')}
				on:change={handleInputChange}
			/>
			<label class="button" for="file-input">Upload a Face</label>
		</form>
		<div>...or Drag 'n Drop a .jpg or .png</div>
	</div>

	<div class="preview-container">
		<div class:hide={!loading} class="status-text loader">Loading...</div>
		<div class:hide={!error} class="status-text error">
			Sorry, something went wrong with the Shrekification. Try again, or use a different image.
		</div>
		<img bind:this={previewImage} class="preview-image" src="" alt="" />
	</div>
</div>

<style>
	.container {
		margin: 30px 0;
	}

	.drop-area {
		width: 300px;
		max-width: 300px;
		height: 300px;
		padding: 20px;
		margin: auto;
		border-radius: 8px;
		box-shadow: rgb(0 0 0 / 30%) 0px 0px 18px 0px inset;
	}

	.highlight {
		box-shadow: lime 0px 0px 18px 0px inset;
	}

	.button-container {
		margin: 0 auto 20px;
	}

	.button {
		font-family: 'Shrek';
		font-size: 26px;
		display: inline-block;
		padding: 10px;
		background: rgb(137, 226, 248);
		cursor: pointer;
		border-radius: 4px;
		border: none;
		color: black;
		margin-bottom: 12px;
		text-decoration: none;
	}

	.button:hover {
		box-shadow: black 0px 0px 10px 0px inset;
	}

	.shrekify-button {
		background: rgb(0, 255, 0);
	}

	.clear-button {
		background: rgb(252, 81, 81);
	}

	#file-input {
		display: none;
	}

	.preview-container {
		position: relative;
		max-width: 500px;
		margin: auto;
	}

	.status-text {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding: 12px 0;
		color: rgb(255, 255, 255);
		text-align: center;
		border-radius: 8px;
	}

	.loader {
		background: rgb(0, 0, 0, 0.6);
	}

	.error {
		background: rgba(100, 0, 0, 0.8);
	}

	.preview-image {
		width: 100%;
		border-radius: 8px;
	}

	.hide {
		display: none;
	}
</style>
