<script lang="ts">
	import type { FormTime } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		time: FormTime
	}

	let { time }: Props = $props()

	let prevTime = $state(time)
	let values = $state(initialValues(time))

	function initialValues({ start, end, hasStartTime }: FormTime) {
		const [startDate = '', startTime = ''] = start?.toISOString().split('T') ?? []
		const [endDate = '', endTime = ''] = end?.toISOString().split('T') ?? []
		return {
			startDate,
			startTime: hasStartTime ? startTime : '',
			endDate,
			endTime: hasStartTime ? endTime : '',
			longerPeriod: !!endDate,
		}
	}

	$effect(() => {
		if (
			time.start !== prevTime.start ||
			time.end !== prevTime.end ||
			time.hasStartTime !== prevTime.hasStartTime
		) {
			prevTime = time
			values = initialValues(time)
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

	$effect(() => {
		time = prevTime = getTime()
	})

	function getTime(): FormTime {
		const { startDate, startTime, endDate, endTime, longerPeriod } = values
		return {
			hasStartTime: !!startTime,
			start: longerPeriod ? dateFrom(startDate) : dateFrom(startDate, startTime),
			end: longerPeriod ? dateFrom(endDate) : dateTimeFrom(startDate, endTime),
		}
	}

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

<label class="checkbox-label">
	<input type="checkbox" bind:checked={values.longerPeriod} />
	Längerer Zeitraum
</label>
<label>
	<em class="required">{values.longerPeriod ? 'Startdatum' : 'Datum, Uhrzeit'}</em>
	<input type="date" bind:value={values.startDate} required />
	{#if !values.longerPeriod}
		von <input type="time" bind:value={values.startTime} />
		bis <input type="time" bind:value={values.endTime} />
	{/if}
</label>
<label class:hidden={!values.longerPeriod}>
	<em class="required">Enddatum</em>
	<input type="date" bind:value={values.endDate} required={values.longerPeriod} />
</label>

<style lang="scss">
	.hidden {
		display: none;
	}

	select,
	input:not([type='checkbox']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
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
	}

	select,
	input[type='text'] {
		box-sizing: border-box;
		width: calc(100% - 150px);

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	.full-width {
		width: 100% !important;
	}

	label {
		display: block;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	.checkbox-label {
		margin: 0.5rem 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 140px;
		padding: 10px 0;
		vertical-align: middle;

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}
</style>
