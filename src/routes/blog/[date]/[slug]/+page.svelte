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

<h1>{data.title}</h1>

<div class="layout">
	<div class="mainbar">
		<div class="published"><PublishDate date={data.published} withDescription /></div>
		<Authors authors={data.authors} />
		<Image class="BlogPost-photo" img={data.photo} width={800} context="Startseite" />
		<FormattedContent parts={data.parts} />
	</div>

	{#if data.related.length > 0}
		<div class="sidebar">
			<h2 class="sidebar-title">Mehr interessante Beiträge</h2>
			<div class="blog-posts">
				{#each data.related as post}
					<BlogPostPreview {post} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 2rem 4rem;

		:global(p) {
			line-height: 1.7;
		}

		@media (max-width: 78rem) {
			flex-direction: column;
		}
	}

	.published {
		margin-bottom: 1rem;
	}

	.mainbar {
		width: 44rem;
		max-width: 44rem;

		@media (max-width: 78rem) {
			width: auto;
		}
	}

	.sidebar {
		width: 22rem;
		margin: 2.8rem 0 0;

		@media (max-width: 78rem) {
			width: auto;
			max-width: 44rem;
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

	@media (min-width: 78.01rem) {
		.sidebar-title {
			font-size: 1.33rem;
			font-weight: 600;
			margin-bottom: 1em;
		}
	}

	:global(.BlogPost-photo) {
		border-radius: 30px;
		margin-bottom: 1rem;
		width: 100%;
		max-width: 44rem;
		height: auto;
	}
</style>
