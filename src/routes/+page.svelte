<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import type { Item } from '$lib/contentful/types'
	import type { StaticPage } from '$lib/data'

	export let data: Item<StaticPage>
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<section>
	<RichText data={data.fields.content} width={900} />
</section>
