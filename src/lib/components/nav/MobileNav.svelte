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
			height: calc(90vh - 12rem);
			margin-top: calc(12rem - 90vh);
			background-color: #a664b4;
			overflow: hidden;
			transition: 0.4s;

			&:global(.extended) {
				margin-top: 0;
			}

			&::after {
				content: '';
				position: absolute;
				box-shadow: inset 0 -80px 40px -40px #a664b4;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 80px;
				pointer-events: none;
			}
		}

		.mobile-nav-inner {
			padding: 1.8rem;
			overflow: auto;

			.nav-group {
				border-radius: 25px;
				box-shadow: 0 0 0 0 #fff2;
				transition:
					box-shadow 0.2s,
					padding-bottom 0.2s;
				padding-bottom: 0;

				&:global(.extended) {
					box-shadow: 0 0 0 3px #fff2;
					padding-bottom: 1rem;

					.nav-extender {
						transform: rotate(0deg);
					}

					.nav-child {
						display: block;
						line-height: 1;
						padding: 1rem 2rem;
						overflow: hidden;
					}
				}
			}

			.nav-row {
				display: flex;
			}

			.nav-child {
				line-height: 0;
				padding: 0 2rem;
				overflow: hidden;
				transition:
					line-height 0.2s,
					padding 0.2s;
			}

			.nav-extender {
				flex-grow: 0;
				border: none;
				border-radius: 100px;
				box-shadow: inset 0 0 0 0.66rem #a664b4;
				background-color: transparent;
				width: calc(2.8rem + 25px);
				padding: 0;
				background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8"><path style="fill: none; stroke: white; stroke-linejoin: round; stroke-linecap: round" d="M1 3 L 4 6 L 7 3" /></svg>');
				background-repeat: no-repeat;
				background-size: 25px;
				background-position: center center;
				transform: rotate(-90deg);
				transition: transform 0.2s;

				&:hover,
				&:focus {
					background-color: #0002;
				}
			}

			a {
				display: block;
				flex-grow: 1;
				color: white;
				padding: 1.4rem;
				text-decoration: none;
				font-weight: 500;
				font-size: 1.4rem;
				line-height: 25px;
				border-radius: 30px;

				&.nav-child {
					margin: 0 1rem;
					border-radius: 20px;
					font-size: 1.3rem;
				}

				&:hover,
				&:focus {
					background-color: #0002;
				}
			}
		}
	}
</style>
