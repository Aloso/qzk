<script lang="ts">
	import { page } from '$app/stores'
	import type { StaticPageTransformed } from '$lib/data'
	import { error } from '@sveltejs/kit'

	import ContactForm from './ContactForm.svelte'
	import IgFeed from './IgFeed.svelte'
	import NewsletterSignup from './NewsletterSignup.svelte'
	import YouTubeVideo from './YouTubeVideo.svelte'

	let { data }: { data: StaticPageTransformed } = $props()

	// TODO: This is duplicated in FormattedContent.svelte
</script>

{#each data.parts as part}
	{#if typeof part === 'string'}
		<section>
			{@html part}
		</section>
	{:else if part.type === 'contact-form'}
		<ContactForm
			nextLink="https://{$page.url
				.host}/email/gesendet?context=CONTACT_FORM&backLink={encodeURIComponent($page.url.href)}"
		/>
	{:else if part.type === 'instagram-profile'}
		<IgFeed />
	{:else if part.type === 'newsletter-signup'}
		<NewsletterSignup />
	{:else if part.type === 'youtube'}
		{#if typeof part.param === 'string'}
			<YouTubeVideo videoId={part.param} />
		{:else}
			{error(500, { message: 'YouTube video has no video ID' })}
		{/if}
	{/if}
{/each}

<style lang="scss">
	section {
		max-width: 44rem;
	}
</style>
