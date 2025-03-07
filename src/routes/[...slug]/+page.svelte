<script lang="ts">
	import StaticPage from '$lib/components/StaticPage.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPageTransformed } from '$lib/data'

	interface Props {
		data: StaticPageTransformed
	}

	let { data }: Props = $props()
</script>

<StaticPageHeader {...data} />
<StaticPage {data} />
