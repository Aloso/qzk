<script lang="ts">
	import type { Navigations, TypedNavigation } from '$lib/data'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links } = $props<Props>()

	const startMatches = new Set<string | undefined>(['/blog', '/autor', '/newsletter'])

	function isNavItem(item: TypedNavigation, url: string) {
		if (item.href === url) return true
		if (startMatches.has(item.href) && url.startsWith(item.href!)) return true
		if (item.children.some((c) => isNavItem(c, url))) return true
		return false
	}

	let mobileExtended = $state(false)
</script>

<header>
	<nav class="mobile-nav" class:extended={mobileExtended}>
		{#each links as link}
			<a
				class="mobile-nav-link"
				href={link.href}
				class:active={isNavItem(link, url)}
				on:click={() => (mobileExtended = false)}
			>
				{@html link.text}
			</a>
		{/each}
	</nav>

	<div class="header-i">
		<div class="header-ii">
			<a class="logo-link" href="/">
				<img data-header-logo class="logo" src="/logo.svg" alt="Queeres Zentrum Kassel" />
			</a>
			<nav class="desktop-nav">
				{#each links as link}
					<a class="nav-link" href={link.href} class:active={isNavItem(link, url)}>
						<span class="nav-link-inner">{@html link.text}</span>
					</a>
				{/each}
			</nav>
			<button
				class="burger-menu-button"
				on:click={() => {
					if (document.scrollingElement && document.scrollingElement.scrollTop !== 0) {
						document.scrollingElement.scrollTo({ top: 0, behavior: 'smooth' })
					}

					mobileExtended = !mobileExtended
				}}
			>
				<img src="/burger.svg" alt="Menü" />
			</button>
		</div>
	</div>
</header>

<style lang="scss">
	header {
		font-size: 1.2rem;
		line-height: 2rem;
		letter-spacing: 0.03rem;
		overflow: hidden;
		margin-bottom: -100rem;
		padding-bottom: 101rem;
		z-index: 0;
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

	.desktop-nav {
		display: flex;
		flex-grow: 1;
		align-items: end;
		margin: 0 0 0.5rem;
	}

	a.nav-link {
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
			background-color: hsl(289, 35%, 47%);
		}

		&.active {
			background-color: hsl(289, 35%, 47%);
		}
	}

	.nav-link-inner {
		display: block;
	}

	.burger-menu-button,
	.mobile-nav {
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

		.desktop-nav {
			display: none;
		}

		.burger-menu-button {
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

		.mobile-nav {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			height: 30rem;
			margin-top: -30rem;
			padding: 2rem;
			background-color: hsl(289, 35%, 55%);
			overflow: hidden;
			transition: 0.4s;

			&.extended {
				margin-top: 0;
			}

			a {
				color: white;
				padding: 1.6rem;
				text-decoration: none;
				font-weight: 500;
				font-size: 1.4rem;
				border-radius: 30px;

				&:hover,
				&:focus {
					background-color: #0002;
				}
			}
		}
	}
</style>
