<script lang="ts">
	import type { Item } from '$lib/contentful/types'
	import type { StaticPage } from '$lib/data'
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

	export let data: Item<StaticPage>
</script>

<svelte:head>
	<title>Startseite</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<section>
	{@html documentToHtmlString(data.fields.content)}
</section>
