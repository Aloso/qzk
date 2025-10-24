<script lang="ts">
	import AuthorComponent from './Author.svelte'
	import type { PersonPreview } from '$lib/data'

	interface Props {
		authors: PersonPreview[]
	}

	let { authors }: Props = $props()
</script>

<div class="authors">
	{#each authors as author (author.slug)}
		<AuthorComponent {author} />
	{/each}
</div>

<style lang="scss">
	.authors {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 2rem;
	}
</style>
