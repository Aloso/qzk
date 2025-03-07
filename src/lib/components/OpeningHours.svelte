<script lang="ts">
	import type { GeneralInfoTransformed } from '$lib/data'

	let { openingHours, specialOpeningHours }: GeneralInfoTransformed = $props()

	const weekDayTranslations: Record<string, string> = {
		mon: 'Montags',
		tue: 'Dienstags',
		wed: 'Mittwochs',
		thu: 'Donnerstags',
		fri: 'Freitags',
		sat: 'Samstags',
		sun: 'Sonntags',
	}

	const todayMidnight = new Date()
	todayMidnight.setHours(0, 0, 0, 0)
	const special = specialOpeningHours.filter(
		({ date }) => new Date(date).getTime() >= todayMidnight.getTime(),
	)
</script>

<div class="opening-hours">
	{#each Object.entries(openingHours).filter(([_, ranges]) => ranges.length > 0) as [name, ranges]}
		<div class="row">
			<span class="label">{weekDayTranslations[name]}</span>
			<span>{ranges.map(r => `${r.from} – ${r.to} Uhr`).join(', ')}</span>
		</div>
	{/each}

	{#if special.length > 0}
		<hr />
		{#each special as { date, hours }}
			<div class="row special">
				<span class="label">
					{new Date(date).toLocaleDateString('de-DE', {
						timeZone: 'Europe/Berlin',
						month: 'short',
						day: 'numeric',
						weekday: 'long',
					})}
				</span>
				{#if hours.length > 0}
					<span>{hours.map(r => `${r.from} – ${r.to} Uhr`).join(', ')}</span>
				{:else}
					<span class="closed">geschlossen</span>
				{/if}
			</div>
		{/each}
	{/if}
</div>

<style lang="scss">
	.opening-hours {
		background-color: #eee;
		border: 2px solid #0001;
		padding: 0.7rem 1rem;
		border-radius: 15px;

		hr {
			margin: 10px 0;
		}

		.row {
			display: flex;
			gap: 1rem;
			padding: 5px 0;
			justify-content: space-between;

			&.special {
				font-style: italic;
			}

			.closed {
				color: #bc0000;
			}
		}
	}
</style>
