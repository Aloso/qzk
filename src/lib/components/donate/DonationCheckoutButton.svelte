<script lang="ts">
	interface Props {
		interval: 'once' | 'month' | 'year'
		amount: number
		primary?: boolean
	}

	let { interval, amount, primary }: Props = $props()

	function formatEuro(amount: number | null) {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currencyDisplay: 'name',
			trailingZeroDisplay: 'stripIfInteger',
			currency: 'EUR',
			maximumFractionDigits: 2,
		}).format(amount ?? 0)
	}
</script>

<form method="post" action="/spende/checkout" class:hidden={!amount}>
	<input type="hidden" name="interval" value={interval} />
	<input type="hidden" name="amount" value={amount} />

	<button type="submit" class:primary>
		{interval === 'once' ? 'Einmalig' : interval === 'month' ? 'Monatlich' : 'Jährlich'}
		<b>{formatEuro(amount)}</b> spenden
	</button>
</form>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;
	@use '../../utils/glitter.scss' as *;

	form {
		text-align: center;
	}

	button {
		cursor: pointer;
		display: block;
		width: 100%;
		font: inherit;
		line-height: 1.8;
		border-radius: 15px;
		color: white;
		background-color: color.adjust(vars.$COLOR_T4, $lightness: 10%);
		padding: 0.4rem 0.75rem;
		border: none;
		border-radius: 0.5rem;
		transition: 0.2s background-color;
		font-size: 1.166666667rem;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T4;
		}

		&.primary {
			text-shadow:
				1px 1px 3px vars.$COLOR_T4,
				-1px -1px 3px vars.$COLOR_T4;

			@include glitter($base-brightness: 0.2, $maximum-brightness: 0.8);
		}

		&:not(.primary) {
			color: vars.$COLOR_T4;
			background-color: white;
			box-shadow: inset 0 0 0 1.5px color.adjust(vars.$COLOR_T4, $lightness: 10%);

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
			}
		}

		@media (max-width: 540px) {
			font-size: 1.08rem;
		}
	}

	.hidden {
		visibility: hidden;
	}
</style>
