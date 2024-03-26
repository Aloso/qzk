<script lang="ts">
	import type { FormValuesStep2 } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		values: FormValuesStep2
		valid: boolean
	}

	let { values, valid }: Props = $props()

	$effect(() => {
		if (values.startDate) {
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
		valid = !!values.startDate && (values.wholeDay ? !!values.endDate : !!values.startDate)
	})
</script>

<div class="section-title">Zeit</div>
<label class="checkbox-label">
	<input type="checkbox" bind:checked={values.wholeDay} />
	Ganztägig bzw. über mehrere Tage
</label>
<label>
	<em class="required">{values.wholeDay ? 'Startdatum' : 'Datum'}</em>
	<input type="date" bind:value={values.startDate} required />
</label>
<label class:hidden={!values.wholeDay}>
	<em class="required">Enddatum</em>
	<input type="date" bind:value={values.endDate} required={values.wholeDay} />
</label>
<label class:hidden={values.wholeDay}>
	<em class="required">Beginn</em>
	<input type="time" bind:value={values.startTime} required={!values.wholeDay} />
</label>
<label class:hidden={values.wholeDay}>
	<em>Ende</em>
	<input type="time" bind:value={values.endTime} />
</label>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']):not([type='radio']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: top;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	select,
	textarea,
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

	.radio-label,
	.checkbox-label {
		margin: 0.5rem 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 140px;
		padding: 10px 0;
		vertical-align: -12px;

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}
</style>
