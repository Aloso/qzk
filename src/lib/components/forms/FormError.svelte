<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		visible: boolean
		children: Snippet
	}

	let { visible, children }: Props = $props()
</script>

<div class="error" aria-hidden={!visible} class:visible>
	{@render children()}
</div>

<style lang="scss">
	.error {
		display: none;
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
		color: red;

		&.visible {
			display: block;
		}
	}
</style>
