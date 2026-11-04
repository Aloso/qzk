<script lang="ts">
	interface Props {
		amount: number | null
		customAmount?: boolean
	}

	let { amount = $bindable(), customAmount = $bindable() }: Props = $props()

	$effect(() => {
		if (amount === null) return
		const floored = Math.abs(Math.floor(amount))
		if (floored < amount || floored > amount) {
			amount = floored
		}
	})
</script>

<div class="price-cols">
	<button
		class="price-button"
		class:active={amount === 5 && !customAmount}
		type="button"
		onclick={() => {
			amount = 5
			customAmount = false
		}}
	>
		5 €
	</button>
	<button
		class="price-button"
		class:active={amount === 10 && !customAmount}
		type="button"
		onclick={() => {
			amount = 10
			customAmount = false
		}}
	>
		10 €
	</button>
	<button
		class="price-button"
		class:active={amount === 20 && !customAmount}
		type="button"
		onclick={() => {
			amount = 20
			customAmount = false
		}}
	>
		20 €
	</button>
	<button
		class="price-button"
		class:active={amount === 50 && !customAmount}
		type="button"
		onclick={() => {
			amount = 50
			customAmount = false
		}}
	>
		50 €
	</button>

	{#if customAmount}
		<div class="price-input-wrapper">
			<input
				class="price-input"
				type="number"
				min="1"
				step="1"
				bind:value={amount}
				{@attach ref => {
					ref.focus()
					ref.value = ''
				}}
			/>
			<span class="price-input-unit">€</span>
		</div>
	{:else}
		<button
			class="price-button text"
			class:active={customAmount}
			type="button"
			onclick={() => {
				amount = 0
				customAmount = true
			}}
		>
			eigenen Betrag wählen
		</button>
	{/if}
</div>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;
	@use 'sass:color';

	.price-cols {
		display: flex;
		flex-wrap: wrap;
		gap: min(0.5rem, 1vw);
		max-width: 450px;
	}

	.price-button {
		font: inherit;
		font-size: 1.25rem;
		line-height: 1.1em;
		height: 3.3rem;
		padding: 0;
		background-color: white;
		border: 2px solid vars.$COLOR_T2;
		border-radius: 0.75rem;
		width: 55px;
		flex-grow: 1;
		transition: 0.2s;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T1;
			cursor: pointer;
		}

		&.text {
			flex-basis: 100%;
			height: 2.5rem;
			font-size: 1rem;
			flex-grow: 1;
			min-width: 120px;
		}

		&.active {
			background-color: vars.$COLOR_T2;
			border-color: color.adjust(vars.$COLOR_T2, $lightness: -10%);
			font-weight: 650;
		}
	}

	.price-input-wrapper {
		flex-basis: 100%;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		font-size: 1.25rem;
		height: 2.5rem;
		width: 120px;
		min-width: 85px;
		flex-grow: 1;
		background-color: vars.$COLOR_T2;
		border: 2px solid color.adjust(vars.$COLOR_T2, $lightness: -10%);
		border-radius: 0.75rem;
		overflow: hidden;
		font-weight: 600;
	}

	.price-input {
		box-sizing: border-box;
		font: inherit;
		line-height: 1.2em;
		width: calc(100% - 1.5rem);
		height: 2.5rem;
		padding: 0 0 0 0.5rem;
		background-color: transparent;
		border: none;
		transition: 0.2s;
		text-align: center;
		appearance: textfield;
		outline: none;
	}

	.price-input-unit {
		display: inline-block;
		text-align: left;
		width: 1.5rem;
	}
</style>
