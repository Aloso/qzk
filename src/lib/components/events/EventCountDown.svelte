<script lang="ts">
	import { m } from '$lib/paraglide/messages'

	interface Props {
		time: Date
		showLabel?: boolean
	}

	let { time, showLabel }: Props = $props()
	let now = $state(new Date())

	let [diff, daysTotal, hours, minutes, seconds] = $derived.by(() => {
		let diff = Math.floor((time.getTime() - now.getTime()) / 1000)
		const seconds = diff % 60
		const minutes = Math.floor(diff / 60) % 60
		const hours = Math.floor(diff / 3600) % 24
		const daysTotal = Math.floor(diff / 86400)
		return [diff, daysTotal, hours, minutes, seconds]
	})

	$effect(() => {
		const interval = setInterval(() => {
			now = new Date()
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	})
</script>

<div class="next">
	{#if showLabel}
		{m.event_next_appointment()}
	{/if}

	{#if diff > 0}
		<div class="countdown">
			{#if daysTotal !== 0}
				<div class="item">
					<em>{daysTotal}</em>
					{daysTotal !== 1 ? m.event_countdown_days() : m.event_countdown_day()}
				</div>
			{/if}
			<div class="item">
				<em>{String(hours).padStart(2, '0')}</em>
				{m.event_countdown_hours()}
			</div>
			<div class="item">
				<em>{String(minutes).padStart(2, '0')}</em>
				{m.event_countdown_minutes()}
			</div>
			<div class="item">
				<em>{String(seconds).padStart(2, '0')}</em>
				{m.event_countdown_seconds()}
			</div>
		</div>
	{:else}
		Bereits begonnen
	{/if}
</div>

<style lang="scss">
	.next {
		margin: 1rem 0 0 0;
		text-align: center;
	}

	.countdown {
		margin-top: 0.5rem;
		display: flex;
		gap: 1.5rem;
		justify-content: center;

		.item {
			color: #0008;
			font-size: 0.9rem;
		}

		em {
			display: block;
			font-style: normal;
			font-weight: 500;
			font-size: 1.8rem;
			color: #000b;
		}
	}
</style>
