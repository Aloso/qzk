<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { Item } from '$lib/contentful'
	import type { StaticPage } from '$lib/data'

	export let data: Item<StaticPage>
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.fields?.content} width={900} />
</section>
