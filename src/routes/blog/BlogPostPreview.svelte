<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import PublishDate from './PublishDate.svelte'
	import Authors from './Authors.svelte'
	import Author from './Author.svelte'
	import type { BlogPostPreview } from '$lib/data'
	import RichText from '$lib/components/RichText.svelte'

	interface Props {
		post: BlogPostPreview
		small?: boolean
	}

	let { post, small } = $props<Props>()
</script>

<div class="blogPost" class:small>
	<Image
		class="BlogPostPreview-photo"
		img={post.photo}
		width={small ? 150 : 250}
		height={small ? 150 : 250}
	/>
	<div class="right">
		{#if small}
			<h3>{post.title}</h3>
			<div class="published combined">
				<PublishDate date={post.published} />
				<Author author={post.authors[0]} small single plus={post.authors.length - 1} />
			</div>
		{:else}
			<h2>{post.title}</h2>
			<div class="published"><PublishDate date={post.published} /></div>
			<Authors authors={post.authors} small />
		{/if}
		<div class="teaser smaller-paragraphs">
			<RichText data={post.teaser} width={700} />
		</div>
		<a href="/blog/{post.published}/{post.slug}">Artikel aufrufen</a>
	</div>
</div>

<style lang="scss">
	.blogPost {
		display: flex;
		gap: 2rem;
	}

	:global(.BlogPostPreview-photo) {
		border-radius: 30px;
		flex-shrink: 0;
		flex-grow: 0;
	}

	.right {
		flex-grow: 1;
		flex-shrink: 1;
	}

	h2,
	h3 {
		margin-top: 0;
	}

	h3 {
		margin-bottom: 1rem;
	}

	.published.combined {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	@media (max-width: 800px) {
		.blogPost {
			flex-direction: column;
		}
	}
</style>
