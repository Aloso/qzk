<script lang="ts">
	import ContactForm from '#lib/components/ContactForm.svelte'
	import Donations from '#lib/components/donate/Donations.svelte'
	import IgFeed from '#lib/components/IgFeed.svelte'
	import NewsletterSignup from '#lib/components/NewsletterSignup.svelte'
	import YouTubeVideo from '#lib/components/YouTubeVideo.svelte'
	import type { DonationsInfo } from '#lib/contentful/data.ts'
	import { m } from '#lib/paraglide/messages.js'
	import { getLocale } from '#lib/paraglide/runtime.js'
	import { page } from '$app/state'
	import { error } from '@sveltejs/kit'

	interface Props {
		data: DonationsInfo['fields']
	}

	let { data }: Props = $props()
	let locale = getLocale()

	let amount = $state(10)

	let [tab, monthly] = $derived.by(() => {
		if (page.params.tab === 'monatlich') {
			return ['lastschrift', true] as const
		} else if (page.params.tab === undefined) {
			return ['lastschrift', false] as const
		} else if (page.params.tab === 'paypal') {
			return ['paypal', false] as const
		} else if (page.params.tab === 'ueberweisung') {
			return ['ueberweisung', false] as const
		} else {
			return [undefined, false] as const
		}
	})
</script>

<svelte:head>
	<title>{m.donations_title()} | Queeres Zentrum Kassel</title>
	<meta name="description" content={m.donations_desc()} />
</svelte:head>

<section>
	<h1>{m.donations_title()}</h1>

	{#each locale === 'en' ? data.descriptionEn : data.description as part, i (i)}
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
				{error(500, 'YouTube video has no video ID')}
			{/if}
		{/if}
	{/each}
</section>

<Donations bind:amount {tab} {monthly} donationsInfo={data} />

<section>
	{#each locale === 'en' ? data.finalDescriptionEn : data.finalDescription as part, i (i)}
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
				{error(500, 'YouTube video has no video ID')}
			{/if}
		{/if}
	{/each}
</section>

<style lang="scss">
	section {
		max-width: 44rem;
	}
</style>
