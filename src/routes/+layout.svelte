<script lang="ts">
	import { page } from '$app/stores'
	import Header from './Header.svelte'
	import Footer from './Footer.svelte'
	import './styles.scss'
	import type { Navigations } from '$lib/data'

	let { data } = $props<{ data: Navigations }>()

	if (globalThis.location && globalThis.location.host === 'www.queereszentrumkassel.de') {
		globalThis.location.replace(globalThis.location.href.replace(/www\./, ''))
	}
</script>

<div class="app">
	<Header url={$page.url.pathname} links={data.header} />

	<main>
		<slot />
	</main>

	<Footer links={data.footer} />
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
