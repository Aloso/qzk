<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import type { StaticPage } from '$lib/data'
	import * as timely from '$lib/timely/embedScript'
	import { onMount } from 'svelte'

	interface Props {
		data: StaticPage
	}

	let { data } = $props<Props>()

	let timelyNode = $state<HTMLElement>()

	onMount(() => {
		timely.run({
			id: 'timely_script',
			src: 'https://events.timely.fun/q9g7m151/?nofilters=1&lang=de-DE',
			insertBefore: timelyNode!,
		})
	})
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<div class="layout">
	<section class="mainbar">
		<RichText data={data.content} width={900} />
	</section>

	<div class="sidebar">
		<div class="sidebar-title">Veranstaltungen</div>
		<div bind:this={timelyNode} />
	</div>
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 4rem;

		@media (max-width: 1200px) {
			flex-direction: column;
		}
	}

	.mainbar {
		width: 44rem;

		@media (max-width: 1200px) {
			width: auto;
		}
	}

	.sidebar {
		width: 22rem;
		margin: 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 1200px) {
			width: auto;
		}
	}

	.sidebar-title {
		font-size: 1.33rem;
		font-weight: 600;
		margin-bottom: 1em;
	}

	section {
		max-width: 44rem;
	}

	:global(#timely-iframe-embed-0) {
		@media (min-width: 1200px) {
			min-height: 400px;
		}
	}
</style>
