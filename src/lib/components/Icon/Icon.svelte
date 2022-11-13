<script lang="ts">
	export let icon = '';
</script>

<span class={icon} />

<style>
	.redo {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 14px;
		height: 14px;
		border: 2px solid;
		border-right-color: transparent;
		border-radius: 100px;
	}
	.redo::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 6px;
		height: 6px;
		border-top: 2px solid;
		border-right: 2px solid;
		top: -3px;
		right: -1px;
		transform: rotate(68deg);
	}

	.info {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 20px;
		height: 20px;
		border: 2px solid;
		border-radius: 40px;
	}
	.info::after,
	.info::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		background: currentColor;
		left: 7px;
	}
	.info::after {
		bottom: 2px;
		height: 8px;
	}
	.info::before {
		height: 2px;
		top: 2px;
	}

	.download {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 16px;
		height: 6px;
		border: 2px solid;
		border-top: 0;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		margin-top: 8px;
	}
	.download::after {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 8px;
		height: 8px;
		border-left: 2px solid;
		border-bottom: 2px solid;
		transform: rotate(-45deg);
		left: 2px;
		bottom: 4px;
	}
	.download::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		height: 10px;
		background: currentColor;
		left: 5px;
		bottom: 5px;
	}

	.export {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 18px;
		height: 14px;
		border: 2px solid;
		border-top: 0;
		box-shadow: -6px -8px 0 -6px, 6px -8px 0 -6px;
	}
	.export::after,
	.export::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
	}
	.export::before {
		background: currentColor;
		width: 2px;
		height: 14px;
		right: 6px;
		bottom: 5px;
	}
	.export::after {
		width: 6px;
		height: 6px;
		border-left: 2px solid;
		border-top: 2px solid;
		right: 4px;
		bottom: 14px;
		transform: rotate(45deg);
	}

	.upload {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 16px;
		height: 6px;
		border: 2px solid;
		border-top: 0;
		border-bottom-left-radius: 2px;
		border-bottom-right-radius: 2px;
		margin-top: 8px;
	}
	.upload::after {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		width: 8px;
		height: 8px;
		border-left: 2px solid;
		border-top: 2px solid;
		transform: rotate(45deg);
		left: 2px;
		bottom: 4px;
	}
	.upload::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		border-radius: 3px;
		width: 2px;
		height: 10px;
		background: currentColor;
		left: 5px;
		bottom: 3px;
	}

	.image {
		box-sizing: border-box;
		position: relative;
		display: block;
		transform: scale(var(--ggs, 1));
		width: 20px;
		height: 16px;
		overflow: hidden;
		box-shadow: 0 0 0 2px;
		border-radius: 2px;
	}
	.image::after,
	.image::before {
		content: '';
		display: block;
		box-sizing: border-box;
		position: absolute;
		border: 2px solid;
	}
	.image::after {
		transform: rotate(45deg);
		border-radius: 3px;
		width: 16px;
		height: 16px;
		top: 9px;
		left: 6px;
	}
	.image::before {
		width: 6px;
		height: 6px;
		border-radius: 100%;
		top: 2px;
		left: 2px;
	}
</style>
