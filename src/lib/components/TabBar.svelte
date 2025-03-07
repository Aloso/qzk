<script lang="ts" generics="T extends string">
	type NoInfer<A extends any> = [A][A extends any ? 0 : never]

	interface Props {
		tabs: [NoInfer<T>, string][]
		active: T
	}

	let { tabs, active = $bindable() }: Props = $props()

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
		{#each tabs as [tabType, name]}
			<button class:active={active === tabType} onclick={() => (active = tabType)}>{name}</button>
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

			button {
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

		button {
			margin: 0 -2px 0 0;
			background-color: #eee;
			border: 2px solid #ccc;
			padding: 0.5rem 0.8rem;
			white-space: nowrap;
			color: black;
			font: inherit;
			font-size: 1.1rem;
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
