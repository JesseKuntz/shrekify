<script lang="ts">
	type OnClick = () => void;

	export let onClick: OnClick = () => {
		/* default */
	};
	export let hide = false;
	export let color = '192';
	export let disabled = false;
	export let input = '';

	const tag = input ? 'label' : 'button';
</script>

<svelte:element
	this={tag}
	{disabled}
	for={input}
	class={disabled ? 'disabled' : 'pushable'}
	class:hide
	on:click={onClick}
	style="--color:{color}deg"
>
	<span class="shadow" />
	<span class="edge" />
	<span class="front"><slot /></span>
</svelte:element>

<style>
	.pushable {
		position: relative;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		outline-offset: 4px;
		transition: filter 250ms;
		margin-bottom: 12px;
		display: inline-block;
	}

	.disabled {
		position: relative;
		border: none;
		background: transparent;
		padding: 0;
		cursor: not-allowed;
		outline-offset: 4px;
		transition: filter 250ms;
		margin-bottom: 12px;
	}

	.shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		background: hsl(0deg 0% 0% / 0.25);
		will-change: transform;
		transform: translateY(2px);
		transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
	}

	.edge {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 12px;
		background: linear-gradient(
			to left,
			hsl(var(--color) 100% 16%) 0%,
			hsl(var(--color) 100% 32%) 8%,
			hsl(var(--color) 100% 32%) 92%,
			hsl(var(--color) 100% 16%) 100%
		);
	}

	.front {
		font-family: 'Shrek';
		display: block;
		position: relative;
		padding: 12px 42px;
		border-radius: 12px;
		font-size: 22px;
		color: black;
		background: hsl(var(--color) 100% 47%);
		will-change: transform;
		transform: translateY(-4px);
		transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
	}

	.pushable:hover {
		filter: brightness(110%);
	}

	.pushable:hover .front {
		transform: translateY(-6px);
		transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
	}

	.pushable:active .front {
		transform: translateY(-2px);
		transition: transform 34ms;
	}

	.pushable:hover .shadow {
		transform: translateY(4px);
		transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
	}

	.pushable:active .shadow {
		transform: translateY(1px);
		transition: transform 34ms;
	}

	.pushable:focus:not(:focus-visible) {
		outline: none;
	}

	.hide {
		display: none;
	}
</style>
