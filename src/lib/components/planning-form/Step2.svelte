<script lang="ts">
	import type { FormValuesStep2 } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import TimeSlot from './TimeSlot.svelte'

	interface Props {
		values: FormValuesStep2
		valid: boolean
	}

	let { values, valid }: Props = $props()

	$effect(() => {
		valid = !!values.time.start
	})
</script>

<div class="section-title">Zeit</div>
<TimeSlot bind:time={values.time} />

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}
</style>
