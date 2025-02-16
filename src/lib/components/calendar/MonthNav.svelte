<script lang="ts">
	interface Props {
		month: number
		year: number
	}

	let { month = $bindable(), year = $bindable() }: Props = $props()

	let monthName = $derived(
		new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(new Date(year, month, 2)),
	)

	function toPreviousMonth() {
		if (month === 0) {
			month = 11
			year--
		} else {
			month--
		}
	}

	function toNextMonth() {
		if (month === 11) {
			month = 0
			year++
		} else {
			month++
		}
	}
</script>

<div class="month-nav">
	<button onclick={toPreviousMonth} aria-label="Vorheriger Monat"></button>
	<div>{monthName} {year}</div>
	<button onclick={toNextMonth} aria-label="Nächster Monat"></button>
</div>

<style lang="scss">
	.month-nav {
		height: 40px;
		line-height: 40px;
		display: flex;

		button {
			border: none;
			width: 40px;
			height: 40px;
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
				width: 10px;
				height: 10px;
				display: inline-block;
				border: 2px solid #0008;
				border-width: 0 0 2px 2px;
				transform: rotate(45deg);
				margin-right: -5px;
			}

			&:last-child::after {
				content: '';
				width: 10px;
				height: 10px;
				display: inline-block;
				border: 2px solid #0007;
				border-width: 0 2px 2px 0;
				transform: rotate(-45deg);
				margin-left: -5px;
			}
		}

		div {
			flex-grow: 1;
			text-align: center;
			font-size: 1.1rem;
		}
	}
</style>
