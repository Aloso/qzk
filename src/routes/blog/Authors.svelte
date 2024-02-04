<script lang="ts">
	import AuthorComponent from './Author.svelte'
	import type { Author } from '$lib/data'
	import type { Item } from '$lib/contentful/types'

	interface Props {
		authors: Item<Author>[]
		small?: boolean
	}

	let { authors, small } = $props<Props>()
</script>

<div class="authors" class:small>
	{#each authors as author}
		<AuthorComponent author={author.fields} {small} />
	{/each}
</div>

<style lang="scss">
	.authors {
		margin-bottom: 2rem;

		&.small {
			margin-bottom: 1rem;
		}
	}
</style>
