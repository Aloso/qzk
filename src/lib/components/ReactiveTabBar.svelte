<script lang="ts">
	interface Props {
		tabs: string[]
		active: string
	}

	let { tabs, active = $bindable() }: Props = $props()
</script>

<div class="tabs">
	{#each tabs as tab (tab)}
		<button class:active={active === tab} onclick={() => (active = tab)}>
			{tab}
		</button>
	{/each}
</div>

<style lang="scss">
	@use '../../routes/vars.scss' as vars;
	@use 'sass:color';

	.tabs {
		display: flex;
		align-content: flex-start;
		justify-content: stretch;
		margin-bottom: 1rem;
		margin-right: 2px;

		button {
			flex-grow: 1;
			margin: 0 -2px 0 0;
			background-color: white;
			border: 2px solid vars.$COLOR_T2;
			padding: 0.5rem 0.8rem;
			white-space: nowrap;
			color: #333;
			font: inherit;
			font-size: 1.1rem;
			text-decoration: none;
			cursor: pointer;
			transition:
				background-color 0.2s,
				border-color 0.2s;

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
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
				background-color: vars.$COLOR_T2;
				border-color: color.adjust(vars.$COLOR_T2, $lightness: -10%);
				font-weight: 600;
				z-index: 2;
			}
		}
	}
</style>
