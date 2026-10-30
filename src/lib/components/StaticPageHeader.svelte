<script lang="ts">
	import type { StaticPageTransformed } from '#lib/data/index.js'
	import { getLocale } from '#lib/paraglide/runtime.js'

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
