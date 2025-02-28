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
		{#if link.children?.length}
			<div class="nav-group">
				<a href={link.href} class="a" class:active={isNavItem(link, url)}>
					<span class="nav-link-inner">{@html link.text}</span>
				</a>

				<div class="nav-dropdown">
					{#each link.children as child}
						<a href={child.href} class="item">
							{@html child.text}
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<a href={link.href} class="a" class:active={isNavItem(link, url)}>
				<span class="nav-link-inner">{@html link.text}</span>
			</a>
		{/if}
	{/each}

	<button class="a" data-search-button>
		<span class="nav-link-inner">
			<img src="/search.svg" alt=" " /> Suche
		</span>
	</button>
</nav>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;

	nav {
		display: flex;
		flex-grow: 1;
		align-items: end;
		justify-content: center;
		margin: 0.5rem 0;
	}

	.nav-group {
		display: relative;

		&:hover .nav-dropdown,
		&:focus-within .nav-dropdown {
			display: block;
		}
	}

	.nav-dropdown {
		display: none;
		position: absolute;
		text-align: left;
		background-color: vars.$COLOR_T0;
		padding: 0 0 0.67rem 0;
		border-radius: 0 0 15px 15px;
		border: 2px solid vars.$COLOR_T2;
		border-top: 0;
		margin-top: 0.5rem;
		font-size: 1.05rem;
		font-weight: 500;

		&::before {
			content: '';
			position: absolute;
			display: block;
			width: 100%;
			height: 0.5rem;
			left: 0;
			top: -0.5rem;
			background-color: transparent;
		}

		a {
			display: block;
			padding: 0.15rem 1rem;
			text-decoration: none;
			color: vars.$COLOR_T4;

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
				border: none;
			}
		}
	}

	.a {
		background-color: transparent;
		border: none;
		font: inherit;
		color: vars.$COLOR_T4;

		display: flex;
		position: relative;
		flex-direction: column;
		padding: 8px 15px;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		font-weight: 500;
		justify-content: start;
		line-height: 1.25;
		border-radius: 15px;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T1;
		}

		&.active {
			background-color: white;
			color: vars.$COLOR_T4;
			font-weight: 600;
		}
	}

	.nav-link-inner {
		display: block;

		img {
			width: 1em;
			height: 1em;
			margin: -2px 0.33rem -2px 0;
		}
	}

	@media (max-width: 1000px) {
		nav {
			display: none;
		}
	}
</style>
