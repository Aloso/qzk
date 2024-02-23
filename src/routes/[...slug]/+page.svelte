<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'

	export let data: StaticPage
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.content} width={900} />
</section>

<style lang="scss">
	section {
		max-width: 44rem;
	}

	:global(section p) {
		line-height: 1.7;
	}
</style>
