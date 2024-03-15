<script lang="ts">
	import BlogPostPreview from './BlogPostPreview.svelte'
	import type { Data } from './+page.server'

	let { data }: { data: Data } = $props()
	let { posts } = data
</script>

<svelte:head>
	<title>Blog - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Blog</h1>
{#if posts.length === 0}
	<p>Es wurden noch keine Blog Posts veröffentlicht. Schau später nochmal vorbei!</p>
{:else}
	<section>
		{#each posts as post}
			<BlogPostPreview {post} />
		{/each}
	</section>
{/if}

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
</style>
