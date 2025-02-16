<script lang="ts">
	import PublishDate from '../../PublishDate.svelte'
	import Authors from '../../Authors.svelte'
	import Image from '$lib/components/Image.svelte'
	import type { BlogPostViewTransformed } from '$lib/data'
	import BlogPostPreview from '../../BlogPostPreview.svelte'
	import FormattedContent from '$lib/components/FormattedContent.svelte'

	let { data }: { data: BlogPostViewTransformed } = $props()
</script>

<svelte:head>
	<title>{data.title} - Queeres Zentrum Kassel</title>
</svelte:head>

<div class="layout">
	<div class="mainbar">
		<h1>{data.title}</h1>
		<div><PublishDate date={data.published} withDescription /></div>
		<Authors authors={data.authors} />
		<Image class="BlogPost-photo" img={data.photo} width={800} context="Startseite" />
		<FormattedContent parts={data.parts} />
	</div>

	{#if data.related.length > 0}
		<div class="sidebar">
			<h3 class="sidebar-title">Mehr interessante Beiträge</h3>
			<div class="blog-posts">
				{#each data.related as post}
					<BlogPostPreview {post} small noImage />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 2rem 4rem;

		@media (max-width: 1200px) {
			flex-direction: column;
		}
	}

	.mainbar {
		width: 44rem;

		@media (max-width: 1200px) {
			width: auto;
		}
	}

	.sidebar {
		width: 22rem;
		margin: 11rem 0 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 900px) {
			width: auto;
			margin-top: 0;
			border-top: 2px solid #ccc;
		}

		:global(h3) {
			font-size: 1.5rem;
		}

		.blog-posts {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;
		}
	}

	.sidebar-title {
		font-size: 1.33rem;
		font-weight: 600;
		margin-bottom: 1em;
	}

	:global(.BlogPost-photo) {
		border-radius: 30px;
		margin-bottom: 1rem;
		width: 100%;
		max-width: 44rem;
		height: auto;
	}

	.layout :global(section) {
		max-width: 44rem;

		:global(p) {
			line-height: 1.7;
		}
	}
</style>
