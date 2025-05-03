<script lang="ts">
	import { onMount } from 'svelte'

	let searchOpen = $state(false)
	let lazyComponent = $state<Promise<typeof import('./Search.svelte')>>()

	onMount(() => {
		function messageListener(event: MessageEvent) {
			if (event.data && typeof event.data === 'object') {
				if (event.data.type === 'search') {
					searchOpen = true
					if (!lazyComponent) {
						lazyComponent = import('./Search.svelte')
					}
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

{#if searchOpen && lazyComponent}
	{#await lazyComponent then { default: Search }}
		<Search onclose={onClose} onselect={onClose} />
	{/await}
{/if}
