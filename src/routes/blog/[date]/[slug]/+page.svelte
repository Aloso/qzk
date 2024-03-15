<script lang="ts">
	import PublishDate from '../../PublishDate.svelte'
	import Authors from '../../Authors.svelte'
	import Image from '$lib/components/Image.svelte'
	import type { BlogPostView } from '$lib/data'
	import RichText from '$lib/components/RichText.svelte'
	import BlogPostPreview from '../../BlogPostPreview.svelte'

	let { data }: { data: BlogPostView } = $props()
</script>

<svelte:head>
	<title>{data.title} - Queeres Zentrum Kassel</title>
</svelte:head>

<div class="layout">
	<div class="mainbar">
		<h1>{data.title}</h1>
		<div><PublishDate date={data.published} withDescription /></div>
		<Authors authors={data.authors} />
		<Image class="BlogPost-photo" img={data.photo} width={800} />
		<section>
			<RichText data={data.content} width={800} />
		</section>
	</div>

	{#if data.related.length > 0}
		<div class="sidebar">
			<div class="sidebar-title">Mehr interessante Beiträge</div>
			{#each data.related as post}
				<BlogPostPreview {post} small noImage />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 4rem;

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
		margin: 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 900px) {
			width: auto;
		}

		:global(h3) {
			font-size: 1.5rem;
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

	section {
		max-width: 44rem;
	}

	:global(section p) {
		line-height: 1.7;
	}
</style>
