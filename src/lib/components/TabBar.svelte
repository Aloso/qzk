<script lang="ts">
	interface Props {
		urls: [url: string, id: string, name: string, options?: { newTab?: boolean }][]
		active: string
		pink?: boolean
		reset?: boolean
	}

	let { urls, active, reset, pink }: Props = $props()

	let elemWidth = $state(0)
	let maxInnerWidth = $state(0)
	let vertical = $derived(elemWidth < maxInnerWidth)

	function refWidthChanged(width: number) {
		maxInnerWidth = Math.max(maxInnerWidth, width)
	}
</script>

<div class="tabs" class:vertical class:pink bind:clientWidth={elemWidth}>
	<div class="tabs-inner" bind:clientWidth={() => 0, refWidthChanged}>
		{#each urls as [url, id, name, options] (url)}
			<a
				class:active={active === id}
				href={url}
				target={options?.newTab ? '_blank' : undefined}
				data-sveltekit-reset={reset}
			>
				{name}
			</a>
		{/each}
	</div>
</div>

<style lang="scss">
	@use '../../routes/vars.scss' as vars;
	@use 'sass:color';

	.tabs {
		display: flex;
		align-content: flex-start;
		margin: 1rem 0;
		position: relative;

		&.vertical {
			.tabs-inner {
				flex-direction: column;
				align-items: start;
			}

			a {
				margin: 0 0 -2px 0;
				width: 100%;

				&:first-child {
					border-radius: 15px 15px 0 0;
				}

				&:last-child {
					border-bottom-left-radius: 15px;
					border-bottom-right-radius: 15px;
					border-top-right-radius: 0;
				}
			}
		}

		.tabs-inner {
			display: flex;
		}

		a {
			margin: 0 -2px 0 0;
			background-color: #eee;
			border: 2px solid #ccc;
			padding: 0.5rem 0.8rem;
			white-space: nowrap;
			color: #333;
			font: inherit;
			font-size: 1.1rem;
			text-decoration: none;
			transition:
				background-color 0.2s,
				border-color 0.2s;

			&:hover,
			&:focus {
				background-color: white;
				border-color: #aaa;
				z-index: 1;
			}

			&:first-child {
				border-radius: 15px 0 0 15px;
			}

			&:last-child {
				border-top-right-radius: 15px;
				border-bottom-right-radius: 15px;
			}

			&.active {
				color: black;
				background-color: white;
				border-color: #aaa;
				font-weight: 600;
				z-index: 1;
			}
		}

		&.pink {
			a {
				background-color: white;
				border: 2px solid vars.$COLOR_T2;

				&:hover,
				&:focus {
					background-color: vars.$COLOR_T1;
					z-index: initial;
				}

				&.active {
					background-color: vars.$COLOR_T2;
					border-color: color.adjust(vars.$COLOR_T2, $lightness: -10%);
					z-index: 2;
				}
			}
		}
	}
</style>
