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
		// {
		// 	text: 'Veranstaltungen',
		// 	url: '/veranstaltungen',
		// },
		// {
		// 	text: 'Zentrum',
		// 	url: '/zentrum',
		// },
		// {
		// 	text: 'Gruppen',
		// 	url: '/gruppen',
		// },
		// {
		// 	text: 'Mitmachen',
		// 	url: '/mitmachen',
		// },
	]

	let { url } = $props<{ url: string }>()
</script>

<header>
	<div class="page-title">Queeres Zentrum Kassel</div>
	<nav>
		<div class="nav-inner">
			{#each links as link}
				<a href={link.url} class:active={link.exact ? url === link.url : url.startsWith(link.url)}>
					{link.text}
				</a>
			{/each}
		</div>
	</nav>
</header>

<style lang="scss">
	.page-title {
		display: block;
		padding: 2.5rem 0 1.7rem;
		text-align: center;
		font-size: 2rem;
		line-height: 3rem;
	}

	nav {
		background-color: #ffdfed;
		font-size: 1.2rem;
		line-height: 1.8rem;
		letter-spacing: 0.03rem;
	}

	.nav-inner {
		max-width: 1300px;
		margin: 0 auto;
		text-align: center;
		padding: 1.4rem;
	}

	a {
		padding: 10px 15px;
		margin: 0 -2px;
		text-decoration: none;
		transition: 0.2s;
		border-radius: 30px;

		&.active {
			background-color: #ffeff6;
		}

		&:hover {
			text-decoration: underline 2px;
			text-underline-offset: 6px;
		}

		&:focus {
			text-decoration: none;
			background-color: white;
			outline: none;
		}
	}
</style>
