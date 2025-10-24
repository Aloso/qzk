<script lang="ts">
	interface Props {
		urls: [string, string, string][]
		active: string
	}

	let { urls, active }: Props = $props()

	let elemWidth = $state(0)
	let maxInnerWidth = $state(0)
	let vertical = $derived(elemWidth < maxInnerWidth)

	function refWidthChanged(width: number) {
		maxInnerWidth = Math.max(maxInnerWidth, width)
	}
</script>

<div class="tabs" class:vertical bind:clientWidth={elemWidth}>
	<div class="tabs-inner" bind:clientWidth={() => 0, refWidthChanged}>
		{#each urls as [url, id, name] (url)}
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
			background-color: #eee;
			border: 2px solid #ccc;
			padding: 0.5rem 0.8rem;
			white-space: nowrap;
			color: black;
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
				background-color: white;
				border-color: #aaa;
				font-weight: 600;
				z-index: 1;
			}
		}
	}
</style>
