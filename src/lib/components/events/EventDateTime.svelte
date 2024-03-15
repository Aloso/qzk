<script lang="ts">
	import type { Event } from '$lib/events/types'

	interface Props {
		time: Event['time']
		concise?: boolean
	}

	let { time, concise }: Props = $props()

	let formatted = $derived.by(() => {
		const wholeDay = !time.start.includes('T')
		const onlyStart = !time.end || time.start === time.end
		if (wholeDay) {
			return onlyStart
				? formatDate(new Date(time.start), concise)
				: formatDateSpan(new Date(time.start), new Date(time.end!), concise)
		} else {
			return (
				formatDate(new Date(time.start), concise) +
				' \u{00A0}' +
				formatTime(new Date(time.start)) +
				(onlyStart ? '' : ' – ' + formatTime(new Date(time.end!)))
			)
		}
	})

	function formatDate(d: Date, concise = false) {
		return d.toLocaleDateString(
			'de-DE',
			concise
				? {
						month: 'numeric',
						day: 'numeric',
						weekday: 'short',
					}
				: {
						month: 'long',
						day: 'numeric',
						weekday: 'long',
					},
		)
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

{formatted}
