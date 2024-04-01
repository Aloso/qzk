<script lang="ts">
	import type { FormValuesStep2 } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import TimeSlot from './TimeSlot.svelte'

	interface Props {
		values: FormValuesStep2
		valid: boolean
	}

	let { values, valid }: Props = $props()

	$effect(() => {
		valid = values.time.every((time) => !!time.start)
	})

	function addSlot() {
		values.time.push({
			hasStartTime: false,
		})
	}

	function removeSlot(index: number) {
		values.time.splice(index, 1)
	}
</script>

<div class="section-title">Zeit</div>
<p class="optional">Angabe der Uhrzeiten ist freiwillig, falls noch nicht bekannt.</p>
{#each values.time as _, i}
	<TimeSlot bind:time={values.time[i]} onRemove={i === 0 ? undefined : () => removeSlot(i)} />
{/each}
<button type="button" class="add-slot" onclick={addSlot}>Weiteren Termin hinzufügen</button>

<style lang="scss">
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
		color: inherit;
		font: inherit;
		font-size: 0.9rem;
		padding: 0.5rem 0.67rem;
		background: #0001;
		border: 2px solid #0002;
		border-radius: 20px;
		margin: 0 calc(-0.5rem - 2px);

		&:hover {
			background: #0002;
		}
	}
</style>
