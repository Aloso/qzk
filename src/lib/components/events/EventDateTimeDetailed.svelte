<script lang="ts">
	import type { Time } from '$lib/events/types'

	interface Props {
		time: Time
		withWeekday?: boolean
	}

	let { time, withWeekday = false }: Props = $props()

	let formatted = $derived.by(() => {
		if (time.start == null) return 'ERROR'

		switch (time.variant) {
			case 'day':
				return `<i class="lone">${formatDate(time.start, withWeekday)}</i>`
			case 'time':
				return `<i>${formatDate(time.start, withWeekday)}</i>${formatTime(time.start)}`
			case 'day-range':
				return `<i class="lone">${formatDateSpan(time.start, time.end!, withWeekday)}</i>`
			case 'time-range':
				return `<i>${formatDate(time.start, withWeekday)}</i>${formatTime(time.start)} – ${formatTime(time.end!)}`
		}
	})

	function formatDate(d: Date, withWeekday: boolean) {
		return d
			.toLocaleDateString('de-DE', {
				year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
				month: 'numeric',
				day: 'numeric',
				weekday: withWeekday ? 'long' : undefined,
			})
			.replace(/^([a-z]{2})\./i, '$1')
			.replace(/(\d)\.(?=\d)/g, '$1. ')
	}

	function formatTime(d: Date) {
		return d.toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	function formatDateSpan(start: Date, end: Date, withWeekday: boolean) {
		return formatDate(start, withWeekday) + ' – ' + formatDate(end, withWeekday)
	}
</script>

{@html formatted}
