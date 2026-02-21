<script lang="ts">
	import type { StaticPageTransformed } from '$lib/data'
	import { getLocale } from '$lib/paraglide/runtime'

	let { name, nameEn, description, descriptionEn }: StaticPageTransformed = $props()
	let locale = getLocale()
</script>

<svelte:head>
	<title>{locale === 'en' ? (nameEn ?? name) : name} | Queeres Zentrum Kassel</title>
	{#if description}
		<meta
			name="description"
			content={locale === 'en' ? (descriptionEn ?? description) : description}
		/>
	{/if}
</svelte:head>
