<script>
	import { page } from '$app/stores'
	import Header from './Header.svelte'
	import Footer from './Footer.svelte'
	import './styles.scss'
</script>

<div class="app">
	<Header url={$page.url.pathname} />

	<main>
		<slot />
	</main>

	<Footer />
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
	}
</style>
