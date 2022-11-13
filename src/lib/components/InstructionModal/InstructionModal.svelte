<script lang="ts">
	import { writable } from 'svelte/store';
	import Modal, { bind } from 'svelte-simple-modal';
	import { Button } from 'src/lib/components';
	import Content from './Content.svelte';

	const modal = writable(null);
	const showModal = () => modal.set(bind(Content, {}));
</script>

<Modal show={$modal}>
	<Button color={'40'} onClick={showModal} icon="info">Instructions</Button>
</Modal>
