<script lang="ts">
	import type { Time } from '$lib/events/types'
	import { m } from '$lib/paraglide/messages'
	import { getLocale } from '$lib/paraglide/runtime'
	import { daysUntil } from '../timeCalc'

	interface Props {
		time: Time
	}

	let { time }: Props = $props()
	let locale = getLocale()

	let formatted = $derived.by(() => {
		if (time.start == null) return 'ERROR'

		switch (time.variant) {
			case 'day':
				return `<i class="lone">${formatDate(time.start)}</i>`
			case 'time':
			case 'time-range':
				return `<i>${formatDate(time.start)}</i>${formatTime(time.start)}`
			case 'day-range':
				return `<i class="lone">${formatDateSpan(time.start, time.end!)}</i>`
		}
	})

	function formatDate(d: Date) {
		const days = daysUntil(d)
		if (days >= -1 && days < 6) {
			if (days === -1) return m.event_yesterday()
			else if (days === 0) return `<em>${m.event_today()}</em>`
			else if (days === 1) return `<em>${m.event_tomorrow()}</em>`
			else {
				return `<em>${d.toLocaleDateString(locale, { timeZone: 'Europe/Berlin', weekday: 'long' })}</em>`
			}
		}

		return d
			.toLocaleDateString(locale, {
				timeZone: 'Europe/Berlin',
				month: 'numeric',
				day: 'numeric',
				weekday: 'short',
			})
			.replace(/^(\w\w)\./, '$1')
			.replace(/(\d)\.(\d)/, '$1. $2')
	}

	function formatTime(d: Date) {
		const time = d.toLocaleTimeString(locale, {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
		})
		return locale === 'en' ? time.replace(/^0|:00/g, '') : time
	}

	function formatDateSpan(start: Date, end: Date) {
		return formatDate(start) + ' – ' + formatDate(end)
	}
</script>

{@html formatted}
