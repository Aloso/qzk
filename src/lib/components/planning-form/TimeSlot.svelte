<script lang="ts">
	import type { Time } from '$lib/events/types'

	interface Props {
		time: Partial<Time>
	}

	let { time }: Props = $props()

	let prevTime = $state(time)
	let values = $state(initialValues(time.start, time.end))

	function initialValues(start?: string, end?: string) {
		const [startDate = '', startTime = ''] = start?.split('T') ?? []
		const [endDate = '', endTime = ''] = end?.split('T') ?? []
		return {
			startDate,
			startTime,
			endDate,
			endTime,
			longerPeriod: !!start && !!end && startDate !== endDate,
		}
	}

	$effect(() => {
		if (time.start !== prevTime.start || time.end !== prevTime.end) {
			prevTime = time
			values = initialValues(time.start, time.end)
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

	function getTime(): Partial<Time> {
		return {
			start: values.longerPeriod
				? values.startDate || undefined
				: values.startDate === ''
					? undefined
					: values.startTime === ''
						? values.startDate
						: `${values.startDate}T${values.startTime}`,
			end: values.longerPeriod
				? values.endDate || undefined
				: values.endTime === ''
					? undefined
					: values.endTime === ''
						? values.startDate
						: `${values.startDate}T${values.endTime}`,
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
