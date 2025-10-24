<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import BlogPostPreview from '../../blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
	const { person, posts, totalPosts } = data
</script>

<svelte:head>
	<title>{person.name} - Queeres Zentrum Kassel</title>
</svelte:head>

<div>
	<div class="person-layout">
		<Image
			img={person.photo}
			class="Person-photo"
			fallbackAlt="Bild von {person.name}"
			width={400}
		/>
		<div class="content">
			<h1 class="name">{person.name}</h1>
			<div class="role">{person.role}</div>
			{#if person.pronouns}
				<div class="pronouns">Pronomen: {person.pronouns}</div>
			{/if}
			{#if person.description}
				<div class="description">
					{@html person.description}
				</div>
			{/if}
		</div>
	</div>

	<hr />
	<h2>
		{totalPosts}
		{totalPosts === 1 ? 'Beitrag' : 'Beiträge'} von {person.name}
	</h2>
	{#if totalPosts > 20}
		<p>Die neuesten Beiträge werden angezeigt</p>
	{/if}
	<div class="blog-posts">
		{#each posts as post (post.slug)}
			<BlogPostPreview {post} withImage />
		{/each}
	</div>
</div>

<style lang="scss">
	.person-layout {
		display: flex;
		flex-direction: row-reverse;
		align-items: start;
		gap: 2rem;
		margin: 2rem 0;

		@media (max-width: 48rem) {
			flex-direction: column;
		}

		:global(.Person-photo) {
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
