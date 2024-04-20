<script lang="ts">
	import type { Navigations } from '$lib/data'
	import { isNavItem } from './navUtil'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links }: Props = $props()
</script>

<nav id="mobile-nav">
	<div class="mobile-nav-inner">
		<div class="nav-group">
			<div class="nav-row">
				<button class="a nav-link" data-search-button>
					<img src="/search.svg" alt="" /> Suche
				</button>
			</div>
		</div>

		{#each links as link}
			<div class="nav-group">
				<div class="nav-row">
					<a class="nav-link" href={link.href} class:active={isNavItem(link, url)}>
						{@html link.text}
					</a>

					{#if link.children?.length}
						<button data-nav-extender="" class="nav-extender" aria-label="Erweitern"></button>
					{/if}
				</div>
				{#each link.children as child}
					<a class="nav-child" href={child.href}>
						{@html child.text}
					</a>
				{/each}
			</div>
		{/each}
	</div>
</nav>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	#mobile-nav {
		display: none;
	}

	@media (max-width: 1200px) {
		#mobile-nav {
			position: relative;
			z-index: 1;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			height: calc(92vh - 12rem);
			margin-top: calc(12rem - 92vh);
			background-color: vars.$COLOR_T3;
			overflow: hidden;
			transition: 0.4s;

			&:global(.extended) {
				margin-top: 0;
			}

			&::after {
				content: '';
				position: absolute;
				box-shadow: inset 0 -80px 40px -40px vars.$COLOR_T3;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 80px;
				pointer-events: none;
			}
		}

		.mobile-nav-inner {
			padding: 1.5rem;
			padding-bottom: 3rem;
			overflow: auto;

			.nav-group {
				border-radius: 25px;
				box-shadow: 0 0 0 0 #fff2;
				transition:
					box-shadow 0.2s,
					padding-bottom 0.2s;
				padding-bottom: 0;

				&:global(.extended) {
					box-shadow: 0 0 0 3px #0002;
					padding-bottom: 0.7rem;

					.nav-extender {
						transform: rotate(0deg);
					}

					.nav-child {
						display: block;
						line-height: 1;
						padding: 0.83rem 1.4rem;
						overflow: hidden;
					}
				}
			}

			.nav-row {
				display: flex;
			}

			.nav-child {
				line-height: 0;
				padding: 0 1.4rem;
				overflow: hidden;
				transition:
					line-height 0.2s,
					padding 0.2s;
			}

			.nav-extender {
				flex-grow: 0;
				border: none;
				border-radius: 100px;
				box-shadow: inset 0 0 0 0.33rem vars.$COLOR_T3;
				background-color: transparent;
				width: calc(2rem + 19px);
				margin: 3px;
				padding: 0;
				background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8"><path style="fill: none; stroke: white; stroke-linejoin: round; stroke-linecap: round" d="M1 3 L 4 6 L 7 3" /></svg>');
				background-repeat: no-repeat;
				background-size: 25px;
				background-position: center center;
				transform: rotate(-90deg);
				transition: transform 0.2s;

				&:hover,
				&:focus {
					background-color: #ffffff17;
				}
			}

			a,
			.a {
				border: none;
				background-color: transparent;
				font: inherit;
				text-align: left;

				display: block;
				flex-grow: 1;
				color: white;
				padding: 1rem 1.4rem;
				text-decoration: none;
				font-weight: 500;
				font-size: 1.25rem;
				line-height: 25px;
				border-radius: 25px;

				&.nav-child {
					margin: 0 0.7rem;
					border-radius: 20px;
					font-size: 1.1rem;
				}

				&:hover,
				&:focus {
					background-color: #ffffff17;
				}

				img {
					width: 1.15rem;
					height: 1.15rem;
					margin-right: 1rem;
				}
			}
		}
	}
</style>
