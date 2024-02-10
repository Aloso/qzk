<script lang="ts">
	import AuthorComponent from './Author.svelte'
	import type { AuthorPreview } from '$lib/data'

	interface Props {
		authors: AuthorPreview[]
		small?: boolean
	}

	let { authors, small } = $props<Props>()
</script>

<div class="authors" class:small>
	{#each authors as author}
		<AuthorComponent {author} {small} />
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
