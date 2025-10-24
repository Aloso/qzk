<script lang="ts">
	import type { Time } from '$lib/events/types'
	import { daysUntil } from '../timeCalc'

	interface Props {
		time: Time
	}

	let { time }: Props = $props()

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
			if (days === -1) return 'Gestern'
			else if (days === 0) return '<em>Heute</em>'
			else if (days === 1) return '<em>Morgen</em>'
			else {
				return `<em>${d.toLocaleDateString('de-DE', { timeZone: 'Europe/Berlin', weekday: 'long' })}</em>`
			}
		}

		return d
			.toLocaleDateString('de-DE', {
				timeZone: 'Europe/Berlin',
				month: 'numeric',
				day: 'numeric',
				weekday: 'short',
			})
			.replace(/^(\w\w)\./, '$1')
			.replace(/(\d)\.(\d)/, '$1. $2')
	}

	function formatTime(d: Date) {
		return d.toLocaleTimeString('de-DE', {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	function formatDateSpan(start: Date, end: Date) {
		return formatDate(start) + ' – ' + formatDate(end)
	}
</script>

{@html formatted}
