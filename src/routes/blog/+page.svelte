<script lang="ts">
	import BlogPostPreview from './BlogPostPreview.svelte'
	import type { Data } from './+page.server'

	let { data } = $props<{ data: Data }>()
	let { posts } = data
</script>

<svelte:head>
	<title>Blog - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Blog</h1>
<section>
	{#each posts as post}
		<BlogPostPreview {...post} />
	{/each}
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
</style>
