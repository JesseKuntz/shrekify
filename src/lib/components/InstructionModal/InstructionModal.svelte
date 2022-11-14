<script lang="ts">
	import { writable } from 'svelte/store';
	import Modal, { bind } from 'svelte-simple-modal';
	import { Button } from 'src/lib/components';
	import Content from './Content.svelte';

	const modal = writable(null);
	const showModal = () => modal.set(bind(Content, {}));
</script>

<Modal
	show={$modal}
	styleContent={{
		border: '4px solid #3f2a1f',
		borderRadius: '8px',
		background: 'linear-gradient(#dbb098, #67985d)',
		maxHeight: 'calc(100vh - 32px)',
		textAlign: 'left'
	}}
	styleCloseButton={{
		right: '32px'
	}}
	styleWindow={{
		width: '800px',
		margin: '16px auto'
	}}
	styleWindowWrap={{
		margin: '0 16px'
	}}
>
	<Button color={'40'} onClick={showModal} icon="info">Instructions</Button>
</Modal>
