<script lang="ts">
	interface Props {
		tabs: [string, string][]
		active: string
	}

	let { tabs, active } = $props<Props>()
</script>

<div class="tabs">
	{#each tabs as [tabType, name]}
		<button class:active={active === tabType} on:click={() => (active = tabType)}>{name}</button>
	{/each}
</div>

<style lang="scss">
	.tabs {
		border-bottom: 2px solid #aaa;
		margin: 1rem 0;
		padding: 0 12px 0 10px;
		position: relative;

		button {
			margin: 2px -2px -2px 0;
			border-radius: 15px 15px 0 0;
			font-size: 1.2rem;
			background-color: #eee;
			border: 2px solid #aaa;
			padding: 0.5rem 1rem;
			color: black;
			font: inherit;
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
					box-shadow: 5px 5px 0 white;
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
					box-shadow: -5px 5px 0 white;
				}
			}
		}
	}
</style>
