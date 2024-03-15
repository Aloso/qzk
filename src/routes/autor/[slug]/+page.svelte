<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import BlogPostPreview from '../../blog/BlogPostPreview.svelte'
	import RichText from '$lib/components/RichText.svelte'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
	const { author, posts, totalPosts } = data
</script>

<svelte:head>
	<title>{author.name} - Queeres Zentrum Kassel</title>
</svelte:head>

<div>
	<div class="author-layout">
		<Image
			img={author.photo}
			class="Author-photo"
			fallbackAlt="Bild von {author.name}"
			width={400}
		/>
		<div class="content">
			<h1 class="name">{author.name}</h1>
			<div class="role">{author.role}</div>
			<div class="pronouns">Pronomen: {author.pronouns}</div>
			<div class="description">
				<RichText data={author.description} width={700} />
			</div>
		</div>
	</div>

	<hr />
	<h2>
		{totalPosts}
		{totalPosts === 1 ? 'Beitrag' : 'Beiträge'} von {author.name}
	</h2>
	{#if totalPosts > 20}
		<p>Die neuesten Beiträge werden angezeigt</p>
	{/if}
	<div class="blog-posts">
		{#each posts as post}
			<BlogPostPreview {post} small />
		{/each}
	</div>
</div>

<style lang="scss">
	.author-layout {
		display: flex;
		flex-direction: row-reverse;
		align-items: start;
		gap: 2rem;
		margin: 1rem 0;

		@media (max-width: 800px) {
			flex-direction: column;
		}

		:global(.Author-photo) {
			border-radius: 30px;
			flex-shrink: 0;
			max-width: 100%;
			height: auto;
		}
	}

	.name {
		margin-top: 0;
	}

	.pronouns,
	.role {
		margin: 1rem 0;
	}

	.content {
		flex-grow: 1;
	}

	.blog-posts {
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}
</style>
