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
	]

	let { url } = $props<{ url: string }>()
</script>

<header>
	<div class="header-inner">
		<a class="logo-link" href="/">
			<img class="logo" src="/logo.png" alt="Queeres Zentrum Kassel" />
		</a>
		<nav>
			{#each links as link}
				<a
					class="nav-link"
					href={link.url}
					class:active={link.exact ? url === link.url : url.startsWith(link.url)}
				>
					<span class="nav-link-inner">{link.text}</span>
				</a>
			{/each}
		</nav>
	</div>
</header>

<style lang="scss">
	header {
		border-bottom: 3px solid #ff28e2;
		font-size: 1.2rem;
		line-height: 1.8rem;
		letter-spacing: 0.03rem;
	}

	.header-inner {
		display: flex;
		align-items: stretch;
		max-width: 64rem;
		padding: 0 1rem;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.logo-link {
		margin: 1rem 2rem 1rem 0;
		flex-grow: 0;
		flex-shrink: 0;
	}

	.logo {
		width: 67vw;
		max-width: 210px;
		aspect-ratio: 802 / 441;
	}

	nav {
		display: flex;
		flex-grow: 1;
		min-height: 80px;
		align-items: stretch;
	}

	a.nav-link {
		display: flex;
		padding: 10px 15px;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		transform: skewX(7deg);
		font-weight: 600;
		align-items: end;

		&:hover,
		&:focus {
			text-decoration: none;
			background-color: #ffdceb;
			color: var(--color-link);
			outline: none;
		}

		&.active {
			background-color: #ff28e2;
			color: white;
		}
	}

	.nav-link-inner {
		display: block;
		transform: skewX(-7deg);
	}
</style>
