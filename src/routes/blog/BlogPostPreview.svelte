<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import PublishDate from './PublishDate.svelte'
	import type { BlogPostPreviewTransformed, PersonPreview } from '$lib/data'

	interface Props {
		post: BlogPostPreviewTransformed
		withImage?: boolean
	}

	let { post, withImage }: Props = $props()

	function createAuthors(authors: PersonPreview[]) {
		let authorsConcat = authors
			.slice(0, 2)
			.map(a => a.name)
			.join(', ')
		if (authors.length > 2) {
			authorsConcat += ', …'
		}
		return authorsConcat || 'unbekannt'
	}
</script>

<div class="blogPost" class:withImage>
	{#if withImage}
		<Image class="BlogPostPreview-photo" img={post.photo} width={250} height={250} />
	{/if}
	<div class="right">
		<h3 class="small-title">
			<a class="title-link" href="/blog/{post.published}/{post.slug}">{post.title}</a>
		</h3>
		<div class="published">
			<PublishDate date={post.published} /> · von {createAuthors(post.authors)}
		</div>
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

	.published {
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
		font-family: inherit;
		font-weight: 600;
		margin: 0 0 0.5rem 0;
		font-size: 1.4rem;

		@media (min-width: 78.01rem) {
			font-size: 1.2rem;

			.withImage & {
				font-size: 1.4rem;
			}
		}
	}

	@media (max-width: 48rem) {
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
