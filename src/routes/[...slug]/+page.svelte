<script lang="ts">
	import StaticPage from '$lib/components/StaticPage.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPageTransformed } from '$lib/data'

	export let data: StaticPageTransformed
</script>

<StaticPageHeader {...data} />
<StaticPage {data} />
