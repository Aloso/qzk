<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		disabled?: boolean
		children: Snippet
	}

	let { disabled, children }: Props = $props()
</script>

<button type="submit" class:disabled>
	{@render children()}
</button>

<style lang="scss">
	button {
		background-color: var(--color-theme);
		color: white;
		padding: 15px 20px;
		font: inherit;
		color: white;
		border: 2px solid var(--color-theme);
		border-radius: 15px;
		margin: 1.5rem 0 0 0;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}

		&.disabled {
			background-color: #717171;
			border-color: #717171;
		}
	}
</style>
