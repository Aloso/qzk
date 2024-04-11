<script lang="ts">
	import AuthorComponent from './Author.svelte'
	import type { PersonPreview } from '$lib/data'

	interface Props {
		authors: PersonPreview[]
		small?: boolean
	}

	let { authors, small }: Props = $props()
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
