<script lang="ts">
	import { page } from '$app/stores'
	import { error } from '@sveltejs/kit'

	import ContactForm from './ContactForm.svelte'
	import IgFeed from './IgFeed.svelte'
	import NewsletterSignup from './NewsletterSignup.svelte'
	import YouTubeVideo from './YouTubeVideo.svelte'
	import type { ExtraComponent } from '$lib/contentful/render'

	let { parts }: { parts: (string | ExtraComponent)[] } = $props()
</script>

<section>
	{#each parts as part}
		{#if typeof part === 'string'}
			{@html part}
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
</section>
