<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';

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
	const SHREKIFY_API_URL =
		'https://oi3wzjer82.execute-api.us-east-2.amazonaws.com/default/shrekify-v2';

	function calculateSize(img: HTMLImageElement, maxWidth = 1000, maxHeight = 1000) {
		let width = img.width;
		let height = img.height;

		if (width > height) {
			if (width > maxWidth) {
				height = Math.round((height * maxWidth) / width);
				width = maxWidth;
			}
		} else {
			if (height > maxHeight) {
				width = Math.round((width * maxHeight) / height);
				height = maxHeight;
			}
		}

		return { width, height };
	}

	function readFile(file: File, callback: (data: string) => void) {
		const reader = new FileReader();

		reader.onloadend = () => {
			callback(reader.result as string);
		};
		reader.readAsDataURL(file);
	}

	function uploadFile(file: File) {
		error = false;
		loading = true;

		const blobURL = URL.createObjectURL(file);
		const image = new Image();

		image.onload = async () => {
			URL.revokeObjectURL(blobURL);

			const { width, height } = calculateSize(image);

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d');
			ctx?.drawImage(image, 0, 0, width, height);

			const dataUrl = canvas.toDataURL('image/jpeg');

			const rawResponse = await fetch(SHREKIFY_API_URL, {
				method: 'POST',
				body: JSON.stringify({
					file: dataUrl
				})
			});

			if (rawResponse.ok) {
				const response = await rawResponse.json();

				previewImage.src = response.image;
				shrekifiedImage = response.image;
			} else {
				error = true;
			}

			loading = false;
		};

		image.src = blobURL;
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
		const a = document.createElement('a');

		a.href = shrekifiedImage;
		a.download = 'shrekified.png';

		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	}

	async function shareImage() {
		const response = await fetch(shrekifiedImage);
		const blob = await response.blob();

		const files = [
			new File([blob], 'shrekify.jpg', {
				type: 'image/jpeg',
				lastModified: new Date().getTime()
			})
		];

		if (
			navigator.canShare({
				files
			})
		) {
			return navigator.share({
				files
			});
		}

		window.alert('Sorry, sharing is not available in this browser.');
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

<div class="container">
	<div class:hide={!dropped} class="button-container">
		<Button
			color={'124'}
			hide={!!shrekifiedImage}
			onClick={() => file && uploadFile(file)}
			disabled={loading}>Shrekify</Button
		>
		<Button color={'340'} onClick={clearFile} disabled={loading}>Start Over</Button>
		<Button hide={!shrekifiedImage} onClick={downloadImage}>Download</Button>
		<Button color={'290'} hide={!shrekifiedImage || !navigator.canShare} onClick={shareImage}
			>Share</Button
		>
	</div>

	<div class="drop-area" class:highlight={dragging} class:hide={dropped}>
		<form bind:this={form} class="my-form">
			<input
				type="file"
				id="file-input"
				accept={SUPPORTED_TYPES.join(',')}
				on:change={handleInputChange}
			/>
			<Button input="file-input">Upload a Face</Button>
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

	#file-input {
		display: none;
	}

	.preview-container {
		position: relative;
		max-width: 500px;
		margin: 0 24px;
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
