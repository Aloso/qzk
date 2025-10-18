<script lang="ts">
	import type { SubmittedDraft } from '$lib/hooks/createSubmittedDrafts.svelte'
	import { localizeHref } from '$lib/paraglide/runtime'

	interface Props {
		items: SubmittedDraft[]
	}

	let { items }: Props = $props()
</script>

{#if items.length}
	<h2>Eingereichte Veranstaltungen</h2>

	<ul class="drafts-list">
		{#each items as { key, name }}
			<li>
				<a href={localizeHref(`/veranstaltungen/${key}`)}>{name}</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.drafts-list {
		margin: 0;
	}

	li {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
