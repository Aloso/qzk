<script lang="ts">
	import { onMount } from 'svelte'
	import Search from './Search.svelte'

	let searchOpen = $state(false)

	onMount(() => {
		window.__searchInitialized = true
		window.postMessage({ type: 'search-initialized' })

		function messageListener(event: MessageEvent) {
			if (event.data && typeof event.data === 'object') {
				if (event.data.type === 'search') {
					searchOpen = true
				}
			}
		}

		window.addEventListener('message', messageListener)
		return () => window.removeEventListener('message', messageListener)
	})

	function onClose() {
		searchOpen = false
	}
</script>

{#if searchOpen}
	<Search onclose={onClose} onselect={onClose} />
{/if}
