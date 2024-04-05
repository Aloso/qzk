<script lang="ts" generics="T extends string">
	type NoInfer<A extends any> = [A][A extends any ? 0 : never]

	interface Props {
		tabs: [NoInfer<T>, string][]
		active: T
	}

	let { tabs, active = $bindable() }: Props = $props()

	let elemWidth = $state(0)
	let refWidth = $state(0)
	let vertical = $state(false)

	$effect(() => {
		vertical ||= elemWidth < refWidth
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
		border-bottom: 2px solid #aaa;
		margin: 1rem 0;
		position: relative;

		&.vertical {
			border-bottom: 0;
			border-left: 2px solid #aaa;

			.tabs-inner {
				flex-direction: column;
				align-items: start;
				padding: 12px 0 10px 0;
			}

			button {
				margin: 0 2px -2px -2px;
				border-radius: 0 15px 15px 0;
				white-space: nowrap;

				&.active {
					border-bottom-color: #aaa;
					border-left-color: white;

					&::before {
						left: -2px;
						bottom: unset;
						top: -10px;
						border-bottom-right-radius: 0;
						border-bottom-left-radius: 7px;
						border-width: 0 0 2px 2px;
						box-shadow: -5px 2px 0 white;
					}

					&::after {
						right: unset;
						left: -2px;
						bottom: -10px;
						border-bottom-left-radius: 0;
						border-top-left-radius: 7px;
						border-width: 2px 0 0 2px;
						box-shadow: -2px -5px 0 white;
					}
				}
			}
		}

		.tabs-inner {
			display: flex;
			padding: 0 12px 0 10px;
		}

		button {
			margin: 2px -2px -2px 0;
			border-radius: 15px 15px 0 0;
			background-color: #eee;
			border: 2px solid #aaa;
			padding: 0.5rem 1rem;
			color: black;
			font: inherit;
			font-size: 1.1rem;
			transition: background-color 0.2s;

			&:hover,
			&:focus {
				background-color: white;
			}

			&.active {
				background-color: white;
				border-bottom-color: white;
				z-index: 1;
				position: relative;

				&::before {
					content: '';
					border: 2px solid #aaa;
					display: block;
					position: absolute;
					left: -10px;
					bottom: -2px;
					width: 8px;
					height: 8px;
					border-bottom-right-radius: 7px;
					border-width: 0 2px 2px 0;
					box-shadow: 5px 2px 0 white;
				}

				&::after {
					content: '';
					border: 2px solid #aaa;
					display: block;
					position: absolute;
					right: -10px;
					bottom: -2px;
					width: 8px;
					height: 8px;
					border-bottom-left-radius: 7px;
					border-width: 0 0 2px 2px;
					box-shadow: -5px 2px 0 white;
				}
			}
		}
	}
</style>
