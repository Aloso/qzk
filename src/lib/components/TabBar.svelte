<script lang="ts">
	interface Props {
		urls: [string, string, string][]
		active: string
	}

	let { urls, active }: Props = $props()

	let elemWidth = $state(0)
	let refWidth = $state(0)
	let maxInnerWidth = $state(0)
	let vertical = $state(false)

	$effect(() => {
		maxInnerWidth = Math.max(maxInnerWidth, refWidth)
	})

	$effect(() => {
		vertical = elemWidth < maxInnerWidth
	})
</script>

<div class="tabs" class:vertical bind:clientWidth={elemWidth}>
	<div class="tabs-inner" bind:clientWidth={refWidth}>
		{#each urls as [url, id, name]}
			<a class:active={active === id} href={url}>{name}</a>
		{/each}
	</div>
</div>

<style lang="scss">
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
			background-color: var(--color-bg2);
			border: 2px solid var(--color-border);
			padding: 0.5rem 0.8rem;
			white-space: nowrap;
			color: var(--color-text-contrast);
			font: inherit;
			font-size: 1.1rem;
			text-decoration: none;
			transition:
				background-color 0.2s,
				border-color 0.2s;

			&:hover,
			&:focus {
				background-color: var(--color-bg);
				border-color: var(--color-inputborder);
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
				background-color: var(--color-bg);
				border-color: var(--color-inputborder);
				font-weight: 600;
				z-index: 1;
			}
		}
	}
</style>
