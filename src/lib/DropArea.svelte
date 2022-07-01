<script lang="ts">
	import { onMount } from 'svelte';

	let dragging = false;
	let dropArea: HTMLElement | null;

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
		const file = files[0];

		console.log(files[0]);

		uploadFile(file);
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

<div class="drop-area center-everything" class:highlight={dragging}>
	<form class="my-form">
		<input type="file" id="fileElem" accept="image/*" on:change={handleInputChange} />
		<label class="button" for="fileElem">Upload a Face</label>
	</form>
	<p>...or Drag 'n Drop</p>
</div>

<style>
	.drop-area {
		width: 300px;
		max-width: 300px;
		height: 300px;
		padding: 20px;
		margin-top: 30px;
		border-radius: 8px;
		box-shadow: rgb(0 0 0 / 30%) 0px 0px 18px 0px inset;
	}

	.highlight {
		box-shadow: lime 0px 0px 18px 0px inset;
	}

	.button {
		display: inline-block;
		padding: 10px;
		background: #ccc;
		cursor: pointer;
		border-radius: 5px;
		border: 1px solid #ccc;
	}

	.button:hover {
		background: #ddd;
	}

	#fileElem {
		display: none;
	}
</style>
