<script lang="ts">
	interface Props {
		time: Date
	}

	let { time }: Props = $props()
	let now = $state(new Date())

	let [daysTotal, hours, minutes, seconds] = $derived.by(() => {
		let diff = Math.floor((time.getTime() - now.getTime()) / 1000)
		const seconds = diff % 60
		const minutes = Math.floor(diff / 60) % 60
		const hours = Math.floor(diff / 3600) % 24
		const daysTotal = Math.floor(diff / 86400)
		return [daysTotal, hours, minutes, seconds]
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
	Nächster Termin:

	<div class="countdown">
		{#if daysTotal > 0}
			<div class="item">
				<em>{daysTotal}</em>
				{daysTotal !== 1 ? 'Tage' : 'Tag'}
			</div>
		{/if}
		<div class="item">
			<em>{String(hours).padStart(2, '0')}</em>
			Std.
		</div>
		<div class="item">
			<em>{String(minutes).padStart(2, '0')}</em>
			Min.
		</div>
		<div class="item">
			<em>{String(seconds).padStart(2, '0')}</em>
			Sek.
		</div>
	</div>
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
