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
			<div class="times">
				<input type="time" bind:value={values.startTime} />
				bis <input type="time" bind:value={values.endTime} />
			</div>
		</label>
	{/if}

	<div class="filler"></div>

	{#if onRemove}
		<button type="button" class="remove" onclick={onRemove} aria-label="Löschen">
			<svg width="16" height="16" viewBox="0 0 16 16" stroke="currentColor">
				<path d="M2,2 L14,14 M 2,14 L 14,2" stroke-width="2" />
			</svg>
		</button>
	{/if}
</div>

<style lang="scss">
	.time-slot {
		display: flex;
		gap: 0.75rem;
		border: 2px solid #aaa;
		padding: 0.8rem;
		margin: 0 0 -2px 0;
		background-color: white;

		&:first-child {
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
		}
		&:last-child {
			border-bottom-left-radius: 20px;
			border-bottom-right-radius: 20px;
		}
	}

	label {
		display: flex;
		flex-direction: column;
		transition: color 0.2s;

		&:hover,
		&:focus-within {
			color: var(--color-theme);
		}

		em {
			display: block;
			font-style: normal;
			font-size: 0.85rem;
		}
	}

	input {
		background-color: transparent;
		border: none;
		font: inherit;
		font-size: 95%;
		margin: 0 0 -0.4rem 0;
		padding: 0.4rem 0;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: baseline;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	input[type='time'] {
		max-width: 3.5rem;
		min-width: 0;
	}

	.filler {
		flex-grow: 1;
	}

	.remove {
		display: block;
		width: 32px;
		height: 32px;
		padding: 8px;
		color: #b00;
		background: transparent;
		border: none;
		border-radius: 12px;
		margin: -8px -8px 0 -32px;
		cursor: pointer;

		svg {
			display: block;
		}

		&:hover {
			color: #f00;
			background-color: #0001;
		}
	}
</style>
