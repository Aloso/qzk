<script lang="ts">
	import { page } from '$app/state'
	import { error } from '@sveltejs/kit'

	import ContactForm from './ContactForm.svelte'
	import IgFeed from './IgFeed.svelte'
	import NewsletterSignup from './NewsletterSignup.svelte'
	import YouTubeVideo from './YouTubeVideo.svelte'
	import type { ExtraComponent } from '$lib/data'
	import { localizeHref } from '$lib/paraglide/runtime'

	interface Props {
		parts: (string | ExtraComponent)[]
		lang?: string
	}

	let { parts, lang }: Props = $props()

	// TODO: remove this
	let htmlSection = $state<HTMLElement>()
	$effect(() => {
		page.url
		if (htmlSection) {
			const links = [...htmlSection.querySelectorAll('a[href]')]
			for (const link of links) {
				const href = link.getAttribute('href')
				if (href) link.setAttribute('href', localizeHref(href))
			}
		}
	})
</script>

<section bind:this={htmlSection} {lang}>
	{#each parts as part, i (i)}
		{#if typeof part === 'string'}
			{@html part}
		{:else if part.type === 'contact-form'}
			<ContactForm
				nextLink="https://{page.url
					.host}/email/gesendet?context=CONTACT_FORM&backLink={encodeURIComponent(page.url.href)}"
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
