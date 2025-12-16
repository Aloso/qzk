<script lang="ts">
	import type { FormTime, FormValuesTime } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { m } from '$lib/paraglide/messages'
	import TimeSlot from '../TimeSlot.svelte'

	interface Props {
		values: FormValuesTime
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()

	let isAddingTimes = $state(false)

	$effect(() => {
		valid = values.time.every(time => !!time.start)
	})

	function addCustomSlot() {
		values.time.push({ variant: 'day' })
	}

	function addSlotAfterDays(days: number) {
		const times = values.time.filter((t): t is FormTime & { start: Date } => t.start !== undefined)
		if (times.length === 0) return

		const last = times[times.length - 1]
		const variant = last.variant === 'day-range' ? 'day' : last.variant
		const start = last.variant === 'day-range' ? (last.end ?? last.start) : last.start
		const end = variant === 'day' ? last.start : last.end

		const startNew = new Date(start)
		startNew.setDate(startNew.getDate() + days)

		const endNew = end ? new Date(end) : undefined
		endNew?.setDate(endNew.getDate() + days)

		values.time.push({ variant, start: startNew, end: endNew })
	}

	function removeSlot(index: number) {
		values.time.splice(index, 1)
	}
</script>

<div class="section-title">{m.pf_datetime()}</div>
<p class="optional">{m.pf_datetime_optionals()}</p>
<div>
	{#each values.time as _, i (i)}
		<TimeSlot
			bind:time={values.time[i]}
			onRemove={values.time.length < 2 ? undefined : () => removeSlot(i)}
		/>
	{/each}
	{#if (professional || values.time.length < 10) && values.time[0]?.variant !== 'day-range'}
		{#if isAddingTimes}
			<div class="add-slot-area">
				{m.pf_datetime_next()}
				<div class="add-slot-options">
					<button type="button" class="add-slot-action" onclick={() => addSlotAfterDays(7)}>
						{m.pf_datetime_after_weeks({ count: 1 })}
					</button>
					<button type="button" class="add-slot-action" onclick={() => addSlotAfterDays(14)}>
						{m.pf_datetime_after_weeks({ count: 2 })}
					</button>
					<button type="button" class="add-slot-action" onclick={() => addSlotAfterDays(21)}>
						{m.pf_datetime_after_weeks({ count: 3 })}
					</button>
					<button type="button" class="add-slot-action" onclick={addCustomSlot}>
						{m.pf_datetime_other_date()}
					</button>
				</div>
			</div>
		{:else}
			<button type="button" class="add-slot" onclick={() => (isAddingTimes = true)}>
				{m.pf_datetime_add()}
			</button>
		{/if}
	{/if}
</div>

{#if values.time.length === 1}
	<label class="checkbox-label">
		<input
			type="checkbox"
			checked={values.time[0].variant === 'day-range'}
			onchange={e => {
				if (e.currentTarget.checked) {
					values.time[0] = {
						variant: 'day-range',
						start: values.time[0].start,
						end: values.time[0].start,
					}
				} else {
					values.time[0] = {
						variant: 'day',
						start: values.time[0].start,
					}
				}
			}}
		/>
		{m.pf_long_event()}
	</label>
{:else if !professional && values.time.length === 10}
	<p>{m.pf_max_timeslots_reached({ n: 10 })}</p>
{/if}

<style lang="scss">
	@use '../../../../routes/vars';

	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	p {
		margin: 1rem 0;
		font-size: 93%;

		&.optional {
			color: green;
		}
	}

	.add-slot {
		display: block;
		width: 100%;
		color: inherit;
		font: inherit;
		font-size: 0.9rem;
		padding: 0.5rem 0.67rem;
		background: #0001;
		border: 2px solid #aaa;
		border-radius: 0 0 20px 20px;

		&:hover {
			background: #0002;
		}
	}

	.add-slot-area {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		background: #eee;
		border: 2px solid #aaa;
		border-radius: 0 0 20px 20px;
		padding: 0.75rem 1rem 1rem 1rem;
	}

	.add-slot-options {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.add-slot-action {
		font-family: inherit;
		font-weight: normal;
		font-size: 0.9rem;
		border: none;
		color: inherit;
		background-color: #0001;
		display: inline-block;
		padding: 0.4rem 0.6rem;
		border-radius: 10px;

		&:hover,
		&:focus {
			background-color: #0002;
		}
	}

	.checkbox-label {
		display: block;
		margin: 1rem 0;
	}
</style>
