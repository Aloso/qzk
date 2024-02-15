<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from './PlanningForm.svelte'

	let { data } = $props<{ data: StaticPage }>()
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.content} width={900} />
</section>

<hr />

<h2>Veranstaltung einreichen</h2>

<PlanningForm />
