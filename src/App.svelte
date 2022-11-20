<script lang="ts">
	import { DropArea, Footer, InstructionModal } from 'src/lib/components';
</script>

<main class="center-everything">
	<div class="header-container">
		<h1>Shrekify</h1>
		<div class="header-background" />

		<InstructionModal />
	</div>

	<DropArea />

	<Footer />
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
		font-size: 22px;
	}

	.header-container {
		position: relative;
	}

	.header-background {
		background: var(--brown);
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

	@media (max-width: 600px) {
		h1 {
			font-size: 60px;
			padding: 20px 20px;
		}

		.header-container {
			width: 100%;
		}

		.header-background {
			border-radius: 0;
		}
	}
</style>
