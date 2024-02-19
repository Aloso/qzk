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
		noImage?: boolean
	}

	let { post, small, noImage } = $props<Props>()
</script>

<div class="blogPost" class:small>
	{#if !noImage}
		<Image
			class="BlogPostPreview-photo"
			img={post.photo}
			width={small ? 150 : 250}
			height={small ? 150 : 250}
		/>
	{/if}
	<div class="right">
		{#if small}
			<h3><a class="title-link" href="/blog/{post.published}/{post.slug}">{post.title}</a></h3>
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
		gap: 1rem 2rem;
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

	.title-link {
		color: inherit;
		text-decoration: none;

		&:hover,
		&:focus {
			color: var(--color-link);
			text-decoration: var(--link-decoration-hover);
		}
	}

	@media (max-width: 800px) {
		.blogPost {
			flex-direction: column;
		}
	}
</style>
