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
		<div class="header-ii">
			<a class="logo-link" href="/">
				<img data-header-logo class="logo" src="/logo.svg" alt="Queeres Zentrum Kassel" />
			</a>

			<DesktopNav {links} {url} />

			<button id="burger-menu-button">
				<img src="/burger.svg" alt="Menü" />
			</button>
			<script src="/scripts/nav.js"></script>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		font-size: 1.2rem;
		line-height: 2rem;
		letter-spacing: 0.03rem;
		overflow: hidden;
		margin-bottom: -30vh;
		padding-bottom: calc(30vh + 1rem);
		z-index: 0;
		position: relative;
	}

	.header-i {
		margin: -200px -50px 0 -50px;
		padding: 180px 50px 0 50px;
		background-color: hsl(289, 35%, 55%);
		box-shadow: 0 -50px 0 50px hsl(289, 35%, 55%);
		transform: rotate(-3deg);
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
		margin: 1rem 1rem 0.8rem 0;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.logo {
		width: 50vw;
		max-width: 200px;
		aspect-ratio: 800 / 439;
		filter: drop-shadow(0.75px 3px #0001);
	}

	#burger-menu-button {
		display: none;
	}

	@media (max-width: 1200px) {
		.header-i {
			margin: -100px 0 0 -50px;
			padding: 100px 0 0 50px;
			position: relative;
			z-index: 0;
		}

		.header-ii {
			display: flex;
			justify-content: space-evenly;
			align-items: center;
		}

		#burger-menu-button {
			display: block;
			background-color: transparent;
			width: 4rem;
			height: 4rem;
			margin: 0;
			color: white;
			border: none;
			border-radius: 20px;
			transition: background-color 0.2s;
			filter: drop-shadow(0.75px 3px #0001);

			img {
				width: 2rem;
				height: 2rem;
				vertical-align: middle;
			}

			&:hover,
			&:focus {
				background-color: #0002;
			}
		}
	}
</style>
