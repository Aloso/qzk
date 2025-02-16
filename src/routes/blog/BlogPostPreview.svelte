<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import PublishDate from './PublishDate.svelte'
	import Authors from './Authors.svelte'
	import Author from './Author.svelte'
	import type { BlogPostPreviewTransformed } from '$lib/data'

	interface Props {
		post: BlogPostPreviewTransformed
		small?: boolean
		noImage?: boolean
	}

	let { post, small, noImage }: Props = $props()
</script>

<div class="blogPost" class:small>
	{#if !noImage}
		<Image
			class="BlogPostPreview-photo"
			img={post.photo}
			width={small ? 150 : 250}
			height={small ? 150 : 250}
			context="Blog Post: {post.title}"
		/>
	{/if}
	<div class="right">
		{#if small}
			<div class="small-title">
				<a class="title-link" href="/blog/{post.published}/{post.slug}">{post.title}</a>
			</div>
			<div class="published combined">
				<PublishDate date={post.published} /> · von {post.authors[0]?.name ?? 'unbekannt'}
				{post.authors.length > 1 ? ', ...' : ''}
			</div>
		{:else}
			<h2>{post.title}</h2>
			<div class="published"><PublishDate date={post.published} /></div>
			<Authors authors={post.authors} small />
		{/if}
		<div class="teaser smaller-paragraphs">
			{@html post.teaser}
		</div>
		<a class="open-link" href="/blog/{post.published}/{post.slug}">Artikel aufrufen</a>
	</div>
</div>

<style lang="scss">
	@use '../vars.scss' as vars;

	.blogPost {
		display: flex;
		gap: 1rem 2rem;
		margin: 0 0 1rem 0;
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

	h2 {
		margin-top: 0;
	}

	.published.combined {
		display: flex;
		gap: 1rem;
		align-items: center;
		color: #777;
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

	.small-title {
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		font-size: 1.2rem;
	}

	@media (max-width: 800px) {
		.blogPost {
			flex-direction: column;
		}
	}

	.open-link {
		color: inherit;
		text-decoration: none;
		display: inline-block;
		padding: 0.5rem 0.7rem;
		background-color: #eee;
		border-radius: 10px;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T0;
		}
	}
</style>
