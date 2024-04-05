<script lang="ts">
	import type { Time } from '$lib/events/types'

	interface Props {
		time: Time
		concise?: boolean
	}

	let { time, concise }: Props = $props()

	let formatted = $derived.by(() => {
		if (time.start == null) return 'ERROR'

		switch (time.variant) {
			case 'day':
				return `<i>${formatDate(time.start, concise)}</i>`
			case 'time':
				return `<i>${formatDate(time.start, concise)}</i>${formatTime(time.start)}`
			case 'day-range':
				return `<i class="lone">${formatDateSpan(time.start, time.end!, concise)}</i>`
			case 'time-range':
				return `<i>${formatDate(time.start, concise)}</i>${formatTime(time.start)} – ${formatTime(time.end!)}`
		}
	})

	function formatDate(d: Date, concise = false) {
		if (concise) {
			const days = daysUntil(d)
			if (days >= 0 && days < 6) {
				if (days === 0) return '<em>Heute</em>'
				else if (days === 1) return '<em>Morgen<em>'
				else return `<em>${d.toLocaleDateString('de-DE', { weekday: 'long' })}</em>`
			}
		}

		const format = concise
			? ({ month: 'numeric', day: 'numeric', weekday: 'short' } as const)
			: ({ month: 'long', day: 'numeric', weekday: 'long' } as const)
		return d.toLocaleDateString('de-DE', format).replace(/^(\w\w)\./, '$1')
	}

	function daysUntil(date: Date | number, reference?: Date | number): number {
		const ref = reference ? new Date(reference) : new Date()
		ref.setHours(0, 0, 0, 0)

		const target = new Date(date)
		target.setHours(0, 0, 0, 0)
		return Math.round(target.getTime() - ref.getTime()) / 1000 / 60 / 60 / 24
	}

	function formatTime(d: Date) {
		return d.toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	function formatDateSpan(start: Date, end: Date, concise = false) {
		return formatDate(start, concise) + ' – ' + formatDate(end, concise)
	}
</script>

{@html formatted}
