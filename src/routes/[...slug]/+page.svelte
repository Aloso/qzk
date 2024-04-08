<script lang="ts">
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPageTransformed } from '$lib/data'

	export let data: StaticPageTransformed
</script>

<StaticPageHeader {...data} />

<section>
	{@html data.content}
</section>

<style lang="scss">
	section {
		max-width: 44rem;
	}
</style>
