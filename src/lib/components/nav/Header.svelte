<script lang="ts">
	import type { Navigations } from '$lib/data'
	import DesktopNav from './DesktopNav.svelte'
	import MobileNav from './MobileNav.svelte'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links }: Props = $props()
</script>

<header>
	<MobileNav {links} {url} />

	<div class="header-i">
		<a class="logo-link" href="/">
			<img data-header-logo class="logo" src="/logo-colorful.png" alt="Queeres Zentrum Kassel" />
		</a>

		<div class="header-ii">
			<DesktopNav {links} {url} />

			<button id="search-button" data-search-button>
				<img src="/search.svg" alt="Suche" />
			</button>
			<button id="burger-menu-button">
				<img src="/burger.svg" alt="Menü" />
			</button>
		</div>
	</div>
</header>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;

	header {
		font-size: 1.2rem;
		line-height: 2rem;
		letter-spacing: 0.03rem;
		z-index: 2;
		position: sticky;
		top: -182px;

		@media (max-width: 1000px) {
			top: 0;
		}
	}

	.header-i {
		position: relative;
		padding-top: 2rem;
		z-index: 2; // higher than <main>
		background-color: vars.$COLOR_T0;
		border-bottom: 2px solid vars.$COLOR_T2;
		text-align: center;

		@media (max-width: 1000px) {
			text-align: left;
			display: flex;
			padding: 0.5rem 1rem;
			gap: 1rem;
		}
	}

	.header-ii {
		display: flex;
		align-items: stretch;
		max-width: 70rem;
		padding: 0 1rem 0 1rem;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.logo-link {
		margin: 0;
		flex-shrink: 0;
	}

	.logo {
		width: 50vw;
		max-width: 270px;
		aspect-ratio: 868 / 440;

		@media (max-width: 1000px) {
			max-width: 150px;
		}
	}

	#burger-menu-button,
	#search-button {
		display: none;
	}

	@media (max-width: 1000px) {
		.header-i {
			position: relative;
		}

		.header-ii {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			margin: 0 0 0 auto;
		}

		#burger-menu-button,
		#search-button {
			display: block;
			background-color: transparent;
			width: 3rem;
			height: 3rem;
			margin: 0;
			color: black;
			border: none;
			border-radius: 15px;
			transition: background-color 0.2s;

			img {
				width: 1.5rem;
				height: 1.5rem;
				vertical-align: middle;
			}

			&:hover,
			&:focus {
				background-color: color.adjust(vars.$COLOR_T2, $lightness: +5%);
			}
		}
	}
</style>
