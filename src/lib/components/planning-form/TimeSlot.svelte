<script lang="ts">
	import type { FormTime } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		time: FormTime
		onRemove?: () => void
	}

	interface Values {
		startDate?: string
		startTime?: string
		endDate?: string
		endTime?: string
		longerPeriod: boolean
	}

	let { time = $bindable(), onRemove }: Props = $props()

	let prevTime = $state(time)
	let values = $state(initialValues(time))
	$effect(() => {
		if (
			time.start?.getTime() !== prevTime.start?.getTime() ||
			time.end?.getTime() !== prevTime.end?.getTime() ||
			time.variant !== prevTime.variant
		) {
			values = initialValues(time)
			prevTime = time
		}
	})

	function initialValues({ start, end, variant }: FormTime): Values {
		const [startDate = ''] = start?.toISOString().split('T') ?? []
		const [endDate = ''] = end?.toISOString().split('T') ?? []

		const format = { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit' } as const
		const startTime = variant.startsWith('time') ? start!.toLocaleTimeString('de-DE', format) : ''
		const endTime = variant === 'time-range' ? end!.toLocaleTimeString('de-DE', format) : ''

		return { startDate, startTime, endDate, endTime, longerPeriod: variant === 'day-range' }
	}

	$effect(() => {
		const { startDate, startTime, endDate, endTime, longerPeriod } = values
		time = {
			variant: longerPeriod ? 'day-range' : !startTime ? 'day' : !endTime ? 'time' : 'time-range',
			start: longerPeriod ? dateFrom(startDate) : dateFrom(startDate, startTime),
			end: longerPeriod ? dateFrom(endDate) : dateTimeFrom(startDate, endTime),
		}
	})

	$effect(() => {
		if (values.startDate && values.longerPeriod) {
			const start = new Date(
				values.startTime ? `${values.startDate}T${values.startTime}` : values.startDate,
			)
			if (values.endDate) {
				const end = new Date(values.endDate)
				if (end < start) {
					values.endDate = values.startDate
				}
			} else {
				values.endDate = values.startDate
			}
		}
	})

	function dateFrom(date?: string, time?: string): Date | undefined {
		const d = date || undefined
		const t = time || undefined
		if (d) {
			return new Date(t ? `${d}T${t}` : d)
		}
	}
	function dateTimeFrom(date?: string, time?: string): Date | undefined {
		const d = date || undefined
		const t = time || undefined
		if (d && t) {
			return new Date(`${d}T${t}`)
		}
	}
</script>

<div class="time-slot">
	{#if onRemove}
		<button type="button" class="remove" onclick={onRemove}>Entfernen</button>
	{/if}
	<label class="checkbox-label">
		<input type="checkbox" bind:checked={values.longerPeriod} />
		Längerer Zeitraum
	</label>
	<label>
		<em class="required">{values.longerPeriod ? 'Startdatum' : 'Datum'}</em>
		<input type="date" bind:value={values.startDate} required />
	</label>
	{#if values.longerPeriod}
		<label>
			<em class="required">Enddatum</em>
			<input type="date" bind:value={values.endDate} required={values.longerPeriod} />
		</label>
	{:else}
		<label>
			<em class="required">Uhrzeit</em>
			<input type="time" bind:value={values.startTime} />
			bis <input type="time" bind:value={values.endTime} />
		</label>
	{/if}
</div>

<style lang="scss">
	.time-slot {
		border: 2px solid #0002;
		border-radius: 20px;
		padding: 0.65rem 0.75rem;
		margin: 0.75rem 0;
		background-color: white;
	}

	input:not([type='checkbox']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 8px 10px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: middle;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	input[type='time'] {
		text-align: center;
		padding-left: 0.25rem;
		padding-right: 0.25rem;
		max-width: 3.5rem;
	}

	label {
		display: block;
		margin: 0.75rem 0;
		transition: color 0.2s;

		&:last-child {
			margin-bottom: 0;
		}

		&:hover {
			color: var(--color-theme);
		}
	}

	.checkbox-label {
		margin: 0 0 0.5rem 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 6rem;
		padding: 10px 0;
		vertical-align: middle;
	}

	.remove {
		float: right;
		display: block;
		color: white;
		font: inherit;
		font-weight: 500;
		font-size: 0.83rem;
		padding: 0.33rem 0.5rem;
		background: #c00;
		border: none;
		border-radius: 8px;
		margin: 0 0 0 auto;

		&:hover {
			background: #b00;
		}
	}
</style>
