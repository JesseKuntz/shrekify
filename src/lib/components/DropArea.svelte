<script lang="ts">
	import { onMount } from 'svelte';

	let dragging = false;
	let dropped = false;
	let dropArea: HTMLElement | null;
	let file: File | null;
	let loading = false;
	let landscape = false;
	let shrekifiedImage = '';

	function readFile(file: File, callback: (data: string) => void) {
		const reader = new FileReader();

		reader.onloadend = () => {
			callback(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	function uploadFile(file: File) {
		const url = '/shrekify';

		readFile(file, (src) => {
			let formData = new FormData();
			formData.append('file', src);
			formData.append('landscape', landscape ? '1' : '0');

			loading = true;

			let img = document.querySelector('.preview-image') as HTMLImageElement;

			landscape = img.width > img.height;

			console.log(img.width);
			console.log(img.height);
			console.log(landscape);

			fetch(url, {
				method: 'POST',
				body: formData
			})
				.then(async (response) => {
					const json = await response.json();

					let img = document.querySelector('.preview-image') as HTMLImageElement;
					img.src = json.image;
					shrekifiedImage = json.image;
				})
				.catch(() => {
					/* Error. Inform the user */
				})
				.finally(() => {
					loading = false;
				});
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
		readFile(file, (src) => {
			let img = document.querySelector('.preview-image') as HTMLImageElement;
			img.src = src;

			dropped = true;
		});
	}

	function clearFile() {
		file = null;
		dropped = false;

		let img = document.querySelector('.preview-image') as HTMLImageElement;
		img.src = '';
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

		console.log(dropArea);

		if (dropArea) {
			function highlight() {
				dragging = true;
			}
			function unhighlight() {
				dragging = false;
			}

			['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, preventDefaults, false);
			});
			['dragenter', 'dragover'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, highlight, false);
			});
			['dragleave', 'drop'].forEach((eventName) => {
				dropArea && dropArea.addEventListener(eventName, unhighlight, false);
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
		<form class="my-form">
			<input type="file" id="fileElem" accept="image/*" on:change={handleInputChange} />
			<label class="button" for="fileElem">Upload a Face</label>
		</form>
		<div>...or Drag 'n Drop</div>
	</div>

	<div class="preview-container">
		<div class:hide={!loading} class="loader">Loading...</div>
		<img class="preview-image" src="" alt="" />
	</div>
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

	#fileElem {
		display: none;
	}

	.preview-container {
		position: relative;
		max-width: 500px;
		margin: auto;
	}

	.loader {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		padding: 12px 0;
		background: rgb(0, 0, 0, 0.6);
		color: rgb(255, 255, 255);
		text-align: center;
		border-radius: 8px;
	}

	.preview-image {
		width: 100%;
		border-radius: 8px;
	}

	.hide {
		display: none;
	}
</style>
