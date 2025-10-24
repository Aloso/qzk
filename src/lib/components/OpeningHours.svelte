<script lang="ts">
	import type { DateRange, GeneralInfoTransformed } from '$lib/data'
	import { m } from '$lib/paraglide/messages'
	import { getLocale } from '$lib/paraglide/runtime'

	let { openingHours, specialOpeningHours }: GeneralInfoTransformed = $props()
	let locale = getLocale()

	type WeekDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

	const weekDayTranslations: [WeekDayKey, string][] =
		locale === 'de'
			? [
					['mon', 'Montags'],
					['tue', 'Dienstags'],
					['wed', 'Mittwochs'],
					['thu', 'Donnerstags'],
					['fri', 'Freitags'],
					['sat', 'Samstags'],
					['sun', 'Sonntags'],
				]
			: [
					['mon', 'Monday'],
					['tue', 'Tuesday'],
					['wed', 'Wednesday'],
					['thu', 'Thursday'],
					['fri', 'Friday'],
					['sat', 'Saturday'],
					['sun', 'Sunday'],
				]

	const todayMidnight = new Date()
	todayMidnight.setHours(0, 0, 0, 0)
	const special = specialOpeningHours.filter(
		({ date }) => new Date(date).getTime() >= todayMidnight.getTime(),
	)

	const trailingZeroes = /:00($|(?= ))/
	function formatTimeRange(range: DateRange): string {
		if (locale === 'de') {
			return `${range.from.replace(trailingZeroes, '')}\u{2009}–\u{2009}${range.to.replace(trailingZeroes, '')} Uhr`
		} else {
			const [sh, sm] = range.from.split(':')
			const [eh, em] = range.to.split(':')
			const d = new Date()
			d.setHours(+sh, +sm, 0, 0)
			const start = d.toLocaleTimeString(locale, {
				timeZone: 'Europe/Berlin',
				hour: '2-digit',
				minute: '2-digit',
			})
			d.setHours(+eh, +em, 0, 0)
			const end = d.toLocaleTimeString(locale, {
				timeZone: 'Europe/Berlin',
				hour: '2-digit',
				minute: '2-digit',
			})
			return `${start.replace(trailingZeroes, '')}\u{2009}–\u{2009}${end.replace(trailingZeroes, '')}`
		}
	}
</script>

<div class="opening-hours">
	{#each weekDayTranslations.filter(([key, _]) => openingHours[key]?.length > 0) as [key, label] (key)}
		<div class="row">
			<span class="label">{label}</span>
			<span>{openingHours[key].map(formatTimeRange).join(', ')}</span>
		</div>
	{/each}

	{#if special.length > 0}
		<hr />
		{#each special as { date, hours }, i (i)}
			<div class="row special">
				<span class="label">
					{new Date(date).toLocaleDateString(locale, {
						timeZone: 'Europe/Berlin',
						month: 'short',
						day: 'numeric',
						weekday: 'long',
					})}
				</span>
				{#if hours.length > 0}
					<span>{hours.map(formatTimeRange).join(', ')}</span>
				{:else}
					<span class="closed">{m.home_closed()}</span>
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

			@media (max-width: 22rem) {
				flex-direction: column;
				gap: 0;
			}

			&.special {
				font-style: italic;
			}

			.closed {
				color: #bc0000;
			}
		}
	}
</style>
