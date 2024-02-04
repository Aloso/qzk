<script lang="ts">
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
	import Image from '$lib/components/Image.svelte'
	import PublishDate from './PublishDate.svelte'
	import Authors from './Authors.svelte'
	import type { BlogPost } from '$lib/data'

	let { photo, title, slug, authors, published, teaser } = $props<BlogPost>()
</script>

<div class="blogPost">
	<Image class="BlogPostPreview-photo" img={photo} width={250} height={250} />
	<div class="right">
		<h2>{title}</h2>
		<div class="published"><PublishDate date={published} /></div>
		<Authors {authors} small />
		<div class="teaser">
			{@html documentToHtmlString(teaser)}
		</div>
		<a href="/blog/{published}/{slug}">Artikel aufrufen</a>
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

	h2 {
		margin-top: 0;
	}
</style>
