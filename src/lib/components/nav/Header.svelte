<script lang="ts">
	import type { Navigations } from '$lib/data'
	import DesktopNav from './DesktopNav.svelte'
	import MobileNav from './MobileNav.svelte'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links }: Props = $props()
	let y = $state(0)
</script>

<svelte:window bind:scrollY={y} />

<header class:smaller={y > 10}>
	<MobileNav {links} {url} />

	<div class="header-i">
		<a class="logo-link" href="/">
			<img data-header-logo class="logo" src="/logo-colorful.png" alt="Queeres Zentrum Kassel" />
		</a>

		<div class="header-ii">
			<DesktopNav {links} {url} />

			<button id="search-button" data-search-button aria-label="Suche">
				<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="3.75"
						d="M 2 22 L 8 16"
					/>
					<circle
						r="8"
						cx="14.5"
						cy="9.5"
						stroke="currentColor"
						fill-opacity="0"
						stroke-width="3"
					/>
				</svg>
			</button>
			<button id="burger-menu-button" aria-label="Menü">
				<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path
						fill="currentColor"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-width="4"
						d="M3,3L21,3 M3,12L21,12 M3,21L21,21"
					/>
				</svg>
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
		transition: margin-bottom 0.5s;

		@media (max-width: 60rem) {
			top: 0;

			&.smaller {
				margin-bottom: 51px;
			}
		}
	}

	.header-i {
		position: relative;
		padding-top: 2rem;
		z-index: 2; // higher than <main>
		background-color: var(--bg-theme);
		border-bottom: 2px solid var(--bg-theme3);
		text-align: center;

		@media (max-width: 60rem) {
			text-align: left;
			display: flex;
			padding: 0.6rem 0 0.6rem 1rem;
			gap: 1rem;
		}
	}

	.header-ii {
		display: flex;
		align-items: stretch;
		max-width: 70rem;
		padding: 10px 1rem 0;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.logo-link {
		display: block;
		width: fit-content;
		margin: 0 auto;

		@media (max-width: 60rem) {
			margin: 0;
		}
	}

	.logo {
		display: block;
		width: 50vw;
		max-width: 270px;
		aspect-ratio: 868 / 440;
		transition: width 0.5s;

		@media (max-width: 60rem) {
			width: 200px;
			max-width: calc(100vw - 10rem);

			.smaller & {
				width: 100px;
			}
		}

		@media (prefers-color-scheme: dark) {
			filter: invert(70%) hue-rotate(180deg) saturate(200%);
		}
	}

	#burger-menu-button,
	#search-button {
		display: none;
		color: var(--color-theme2);
	}

	@media (max-width: 60rem) {
		.header-i {
			position: relative;
		}

		.header-ii {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			margin: -0.4rem 0 -0.4rem auto;
			padding: 0 1rem;
		}

		#burger-menu-button,
		#search-button {
			display: block;
			background-color: transparent;
			width: 3rem;
			height: 3rem;
			margin: 0;
			border: none;
			border-radius: 15px;
			transition: background-color 0.2s;

			svg {
				width: 1.5rem;
				height: 1.5rem;
				vertical-align: middle;
			}

			&:hover,
			&:focus {
				background-color: var(--bg-theme2);
			}
		}
	}
</style>
