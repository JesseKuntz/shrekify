<script lang="ts">
	import { onMount } from 'svelte';

	let dragging = false;
	let dropped = false;
	let dropArea: HTMLElement | null;
	let file: File | null;

	function uploadFile(file: File) {
		let url = '/shrekify';
		let formData = new FormData();
		formData.append('file', file);

		fetch(url, {
			method: 'POST',
			body: formData
		})
			.then(() => {
				/* Done. Inform the user */
			})
			.catch(() => {
				/* Error. Inform the user */
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

		previewFile(firstFile);

		file = firstFile;
	}

	function previewFile(file: File) {
		let reader = new FileReader();

		reader.readAsDataURL(file);
		reader.onloadend = function () {
			if (typeof reader.result === 'string') {
				let img = document.querySelector('.preview-image') as HTMLImageElement;
				img.src = reader.result;

				dropped = true;
			}
		};
	}

	function clearFile() {
		file = null;
		dropped = false;

		let img = document.querySelector('.preview-image') as HTMLImageElement;
		img.src = '';
	}

	function preventDefaults(e: Event) {
		e.preventDefault();
		e.stopPropagation();
	}

	onMount(() => {
		dropArea = document.querySelector('.drop-area');

		if (dropArea) {
			['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, preventDefaults, false);
			});

			['dragenter', 'dragover'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, highlight, false);
			});
			['dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, unhighlight, false);
			});

			function highlight() {
				dragging = true;
			}

			function unhighlight() {
				dragging = false;
			}

			dropArea.addEventListener('drop', handleDrop, false);
		}
	});
</script>

<div class="container center-everything">
	{#if dropped}
		<div class="button-container">
			<button class="button shrekify-button" on:click={() => file && uploadFile(file)}
				>Shrekify</button
			>
			<button class="button clear-button" on:click={clearFile}>Start Over</button>
		</div>
	{/if}

	{#if !dropped}
		<div class="drop-area" class:highlight={dragging}>
			<form class="my-form">
				<input type="file" id="fileElem" accept="image/*" on:change={handleInputChange} />
				<label class="button" for="fileElem">Upload a Face</label>
			</form>
			<p>...or Drag 'n Drop</p>
		</div>
	{/if}

	<img class="preview-image" src="" alt="" />
</div>

<style>
	.container {
		margin-top: 30px;
	}

	.drop-area {
		width: 300px;
		max-width: 300px;
		height: 300px;
		padding: 20px;
		border-radius: 8px;
		box-shadow: rgb(0 0 0 / 30%) 0px 0px 18px 0px inset;
	}

	.highlight {
		box-shadow: lime 0px 0px 18px 0px inset;
	}

	.button-container {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30px;
		width: 370px;
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
	}

	.button:hover {
		box-shadow: black 0px 0px 10px 0px inset;
	}

	.shrekify-button {
		background: rgb(0, 255, 0);
	}

	.clear-button {
		background: rgb(251, 117, 117);
	}

	#fileElem {
		display: none;
	}

	.preview-image {
		max-width: 300px;
	}
</style>
