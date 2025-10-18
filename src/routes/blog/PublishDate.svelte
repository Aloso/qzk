<script lang="ts">
	import { m } from '$lib/paraglide/messages'
	import { getLocale } from '$lib/paraglide/runtime'

	interface Props {
		date: string
		withDescription?: boolean
	}

	let { date, withDescription }: Props = $props()
	const locale = getLocale()
	const dateFmt = new Date(date).toLocaleDateString(locale, {
		timeZone: 'Europe/Berlin',
		day: '2-digit',
		month: locale === 'en' ? 'short' : '2-digit',
		year: 'numeric',
	})
</script>

{withDescription ? m.blog_published({ date: dateFmt }) : dateFmt}
