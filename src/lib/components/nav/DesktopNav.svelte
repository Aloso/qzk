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
						<a href={child.href}>
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
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke="currentColor" stroke-linecap="round" stroke-width="3.75" d="M 2 22 L 8 16" />
				<circle r="8" cx="14.5" cy="9.5" stroke="currentColor" fill-opacity="0" stroke-width="3" />
			</svg> Suche
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
		position: relative;

		&:hover .nav-dropdown,
		&:focus-within .nav-dropdown {
			display: block;
		}

		&::after {
			content: '';
			position: absolute;
			display: block;
			width: 100%;
			height: 0.5rem;
			left: 0;
			background-color: transparent;
		}
	}

	.nav-dropdown {
		display: none;
		position: absolute;
		text-align: left;
		background-color: var(--bg-theme);
		padding: 0 0 0.67rem 0;
		border-radius: 0 0 15px 15px;
		border: 2px solid var(--bg-theme3);
		border-top: 0;
		margin-top: 0.5rem;
		margin-left: calc(-0.2rem - 2px);
		max-width: 450px;
		max-height: calc(100vh - 300px);
		overflow: auto;
		font-size: 1.05rem;
		font-weight: 500;

		a {
			display: block;
			padding: 0.15rem 1rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			text-decoration: none;
			color: var(--color-theme1);

			&:hover,
			&:focus {
				background-color: var(--bg-theme1);
				border: none;
			}
		}
	}

	.a {
		background-color: transparent;
		border: none;
		font: inherit;
		color: var(--color-theme1);

		display: flex;
		position: relative;
		flex-direction: column;
		padding: 8px 0.8rem;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		font-weight: 500;
		justify-content: start;
		line-height: 1.25;
		border-radius: 15px;

		&:hover,
		&:focus {
			background-color: var(--bg-theme1);
		}

		&.active {
			background-color: var(--color-bg);
			color: var(--color-theme1);
			font-weight: 600;
		}
	}

	.nav-link-inner {
		display: block;

		svg {
			width: 1em;
			height: 1em;
			margin: -2px 0.33rem -2px 0;
		}
	}

	@media (max-width: 60rem) {
		nav {
			display: none;
		}
	}
</style>
