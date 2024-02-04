<script lang="ts">
	import BlogPostPreview from './BlogPostPreview.svelte'
	import type { Entries } from '$lib/contentful/types'
	import type { BlogPost } from '$lib/data'

	export let data: Entries<BlogPost>
</script>

<svelte:head>
	<title>Blog - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Blog</h1>
{#each data.items as post}
	<BlogPostPreview {...post.fields} />
{/each}
