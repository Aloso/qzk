<script lang="ts">
	import type { GeneralInfoTransformed } from '$lib/data'

	let { importantInfo = [] }: GeneralInfoTransformed = $props()
</script>

{#each importantInfo as info}
	<div class="important-info">
		{info}
	</div>
{/each}

<style lang="scss">
	.important-info {
		background-color: var(--color-important);
		border: 2px solid var(--slight-accent);
		padding: 0.9rem 1rem;
		border-radius: 15px;
		margin: 1rem 0 0 0;
	}
</style>
