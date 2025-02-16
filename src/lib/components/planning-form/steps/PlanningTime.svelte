<script lang="ts">
	import type { FormValuesTime } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import TimeSlot from '../TimeSlot.svelte'

	interface Props {
		values: FormValuesTime
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()

	$effect(() => {
		valid = values.time.every(time => !!time.start)
	})

	function addSlot() {
		values.time.push({ variant: 'day' })
	}

	function removeSlot(index: number) {
		values.time.splice(index, 1)
	}
</script>

<div class="section-title">Zeit</div>
<p class="optional">Angabe der Uhrzeiten ist freiwillig, falls noch nicht bekannt.</p>
{#each values.time as _, i}
	<TimeSlot
		bind:time={values.time[i]}
		onRemove={values.time.length < 2 ? undefined : () => removeSlot(i)}
	/>
{/each}
{#if professional || values.time.length < 10}
	<button type="button" class="add-slot" onclick={addSlot}>Weiteren Termin hinzufügen</button>
{:else}
	<p>Maximal 10 Termine können hinzugefügt werden.</p>
{/if}

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

		&:hover {
			background: #0002;
		}
	}
</style>
