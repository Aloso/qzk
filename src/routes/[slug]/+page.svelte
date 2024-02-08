<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import type { Item } from '$lib/contentful/types'
	import type { StaticPage } from '$lib/data'
	import ContactForm from './ContactForm.svelte'

	export let data: Item<StaticPage>
</script>

<svelte:head>
	<title>{data.fields?.name} - Queeres Zentrum Kassel</title>
	{#if data.fields?.description}
		<meta name="description" content={data.fields?.description} />
	{/if}
</svelte:head>

<section>
	<RichText data={data.fields?.content} width={900} />
</section>

{#if data.fields?.slug === 'kontakt'}
	<ContactForm />
{/if}
