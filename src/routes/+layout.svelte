<script lang="ts">
	import { page } from '$app/stores'
	import Footer from '$lib/components/nav/Footer.svelte'
	import Header from '$lib/components/nav/Header.svelte'
	import SearchWrapper from '$lib/components/search/SearchWrapper.svelte'
	import type { Navigations } from '$lib/data'
	import type { Snippet } from 'svelte'
	import './styles.scss'

	interface Props {
		data: Navigations
		children: Snippet
	}

	let { data, children }: Props = $props()

	if (globalThis.location && globalThis.location.host === 'www.queereszentrumkassel.de') {
		globalThis.location.replace(globalThis.location.href.replace(/www\./, ''))
	}
</script>

<div class="app">
	<Header url={$page.url.pathname} links={data.header} />

	<main>
		{@render children()}
	</main>

	<Footer links={data.footer} />

	<SearchWrapper />
	<script src="/scripts/eager.js"></script>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 70rem;
		margin: 0 auto;
		box-sizing: border-box;
		position: relative;
		z-index: 1;
	}
</style>
