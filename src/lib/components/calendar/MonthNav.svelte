<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime'

	interface Props {
		month: number
		year: number
		onChange?: (year: number, month: number) => void
	}

	let { month = $bindable(), year = $bindable(), onChange }: Props = $props()
	let locale = getLocale()

	let monthName = $derived(
		new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(year, month, 2)),
	)

	function toPreviousMonth() {
		if (month === 0) {
			month = 11
			year--
		} else {
			month--
		}
		onChange?.(year, month)
	}

	function toNextMonth() {
		if (month === 11) {
			month = 0
			year++
		} else {
			month++
		}
		onChange?.(year, month)
	}
</script>

<div class="month-nav">
	<button type="button" onclick={toPreviousMonth} aria-label="Vorheriger Monat"></button>
	<div>{monthName} {year}</div>
	<button type="button" onclick={toNextMonth} aria-label="Nächster Monat"></button>
</div>

<style lang="scss">
	.month-nav {
		height: 2.4rem;
		line-height: 2.4rem;
		display: flex;

		button {
			border: none;
			width: 2.4rem;
			height: 2.4rem;
			padding: 0;
			margin: 0;
			background-color: transparent;
			border-radius: 100%;
			font: inherit;
			color: #555;

			&:hover,
			&:focus {
				background-color: #eee;
			}

			&:first-child::after {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				display: inline-block;
				border: 2px solid #0008;
				border-width: 0 0 0.11rem 0.11rem;
				transform: rotate(45deg);
				margin-right: -0.3rem;
			}

			&:last-child::after {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				display: inline-block;
				border: 2px solid #0007;
				border-width: 0 0.11rem 0.11rem 0;
				transform: rotate(-45deg);
				margin-left: -0.3rem;
			}
		}

		div {
			flex-grow: 1;
			text-align: center;
			font-size: 1.1rem;
		}
	}
</style>
