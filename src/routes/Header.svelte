<script lang="ts">
	const links = [
		{
			text: 'Aktuelles',
			url: '/',
			exact: true,
		},
		{
			text: 'Blog',
			url: '/blog',
		},
		{
			text: 'Mitgliedschaft',
			url: '/mitgliedschaft',
		},
		{
			text: 'Kontakt',
			url: '/kontakt',
		},
	]

	let { url } = $props<{ url: string }>()

	// let prevScrollY = 0
	// let scrollY = $state(globalThis.scrollY)
	//
	// $effect(() => {
	// 	let isAtTop = scrollY < 88
	// 	let wasAtTop = prevScrollY < 88
	// 	prevScrollY = scrollY
	// 	if (isAtTop !== wasAtTop) updateLogo(isAtTop)
	// })
	//
	// function updateLogo(isAtTop: boolean) {
	// 	const elem = document.querySelector('[data-header-logo]')
	// 	if (!elem) return
	// 	if (isAtTop) {
	// 		elem.setAttribute('src', '/logo.png')
	// 	} else {
	// 		elem.setAttribute('src', '/logo-2.png')
	// 	}
	// }
</script>

<!-- <svelte:window bind:scrollY /> -->

<svg width="0" height="0">
	<defs>
		<clipPath id="headerClipPath" clipPathUnits="objectBoundingBox">
			<path
				d="M 0,0 H
            1 C 0.84,0.02 0.86,0.8
            0.75,0.65 0.6,0.38 0.58,0.39
            0.5,0.34 0.2,0.25 0.3,1
            0.1,0.9 0.02,0.81 0.003,0.45
            0,0 Z"
			/>
		</clipPath>
	</defs>
</svg>

<header>
	<div class="header-inner">
		<a class="logo-link" href="/">
			<img data-header-logo class="logo" src="/logo-white.png" alt="Queeres Zentrum Kassel" />
		</a>
		<nav>
			{#each links as link}
				<a
					class="nav-link"
					href={link.url}
					class:active={link.exact ? url === link.url : url.startsWith(link.url)}
				>
					<span class="nav-link-inner">{@html link.text}</span>
				</a>
			{/each}
		</nav>
	</div>
</header>

<style lang="scss">
	header {
		font-size: 1.2rem;
		line-height: 1.8rem;
		letter-spacing: 0.03rem;
		z-index: 1;

		// position: sticky;
		// top: 0;
		// top: -88px;
		box-shadow: 0 0 20px 20px white;
	}

	.header-inner {
		display: flex;
		align-items: stretch;
		max-width: 70rem;
		padding: 0 1rem 0 3.5rem;
		box-sizing: border-box;
		margin: 0 auto;

		background-color: hsl(289, 35%, 55%);
		clip-path: url(#headerClipPath);
	}

	.logo-link {
		margin: 1rem 1rem 2rem 0;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.logo {
		width: 67vw;
		max-width: 200px;
		aspect-ratio: 802 / 441;
		filter: drop-shadow(0.75px 3px #0001);
	}

	nav {
		display: flex;
		flex-grow: 1;
		min-height: 80px;
		align-items: stretch;
	}

	a.nav-link {
		display: flex;
		position: relative;
		flex-direction: column;
		padding: 10px 15px;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		transform: skewX(10deg);
		font-weight: 600;
		justify-content: start;
		line-height: 1.25;
		color: white;
		text-shadow: 0.75px 3px #0001;

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
		transform: skewX(-10deg);
	}
</style>
