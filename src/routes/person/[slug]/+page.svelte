<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import { m } from '$lib/paraglide/messages'
	import { getLocale } from '$lib/paraglide/runtime'
	import BlogPostPreview from '../../blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
	let person = $derived(data.person)
	let locale = getLocale()

	function translation<T>(de: T, en: T | undefined): T {
		return locale === 'en' ? (en ?? de) : de
	}
</script>

<svelte:head>
	<title>{person.name} | Queeres Zentrum Kassel</title>
</svelte:head>

<div>
	<div class="person-layout">
		<Image
			img={person.photo}
			class="Person-photo"
			fallbackAlt={m.person_picture_of({ name: person.name })}
			width={400}
		/>
		<div class="content">
			<h1 class="name">{person.name}</h1>
			<div class="role">{translation(person.role, person.roleEn)}</div>
			{#if person.pronouns}
				<div class="pronouns">
					{m.person_pronouns({ pronouns: translation(person.pronouns, person.pronounsEn) })}
				</div>
			{/if}
			{#if person.description}
				<div class="description">
					{@html translation(person.description, person.descriptionEn)}
				</div>
			{/if}
		</div>
	</div>

	<hr />
	<h2>
		{m.person_blog_post_title({ count: data.totalPosts, name: person.name })}
	</h2>
	{#if data.totalPosts > 20}
		<p>{m.person_blog_posts_limit()}</p>
	{/if}
	<div class="blog-posts">
		{#each data.posts as post (post.slug)}
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
