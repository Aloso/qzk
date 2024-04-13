<script lang="ts">
	import type { Navigations } from '$lib/data'
	import { isNavItem } from './navUtil'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links }: Props = $props()
</script>

<nav>
	{#each links as link}
		<a href={link.href} class:active={isNavItem(link, url)}>
			<span class="nav-link-inner">{@html link.text}</span>
		</a>
	{/each}

	<button class="a" data-search-button>
		<span class="nav-link-inner">
			<img src="/search.svg" alt="Suche" />
		</span>
	</button>
</nav>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	nav {
		display: flex;
		flex-grow: 1;
		align-items: end;
		margin: 0 0 0.5rem;
	}

	a,
	.a {
		background-color: transparent;
		border: none;
		font: inherit;

		display: flex;
		position: relative;
		flex-direction: column;
		padding: 12px 15px;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		font-weight: 600;
		justify-content: start;
		line-height: 1.25;
		color: white;
		text-shadow: 0.75px 3px #0001;
		border-radius: 15px;

		&:hover,
		&:focus {
			background-color: lighten(vars.$COLOR_T3, 10%);
		}

		&.active {
			background-color: lighten(vars.$COLOR_T3, 10%);
		}
	}

	.nav-link-inner {
		display: block;

		img {
			width: 1em;
			height: 1em;
		}
	}

	@media (max-width: 1200px) {
		nav {
			display: none;
		}
	}
</style>
