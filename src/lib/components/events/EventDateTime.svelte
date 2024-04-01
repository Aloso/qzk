<script lang="ts">
	import type { Time } from '$lib/events/types'

	interface Props {
		time: Time
		concise?: boolean
	}

	let { time, concise }: Props = $props()

	let formatted = $derived.by(() => {
		if (time.start == null) return 'ERROR'

		if (!time.hasStartTime) {
			return time.end
				? formatDateSpan(time.start, time.end, concise)
				: formatDate(time.start, concise)
		} else {
			return (
				formatDate(time.start, concise) +
				' \u{00A0}' +
				formatTime(time.start) +
				(time.end ? ' – ' + formatTime(time.end) : '')
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
