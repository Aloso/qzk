<script lang="ts">
	import type { FormValuesDecoration } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import type { ChangeEventHandler } from 'svelte/elements'

	interface Props {
		values: FormValuesDecoration
		valid: boolean
	}

	let { values = $bindable(), valid = $bindable() }: Props = $props()
	let automated = $state(false)

	$effect(() => {
		if (values.color1 === -1 && values.color2 === -1) {
			automated = true
			values.color1 = Math.floor(Math.random() * 360)
			values.color2 = generateMatchingAngle(values.color1)
		}

		valid = true
	})

	function generateMatchingAngle(angle: number) {
		let next = angle + Math.random() * 240 - 120
		if (Math.abs(angle - next) < 30) {
			if (next > angle) next += 30
			else next -= 30
		}
		return Math.floor((next + 360) % 360)
	}
</script>

<div class="section-title">Farben</div>

{#if automated}
	<p>Es wurden zwei Farben zufällig ausgewählt. Du kannst sie noch bearbeiten:</p>
{/if}

<div
	class="gradient"
	style="--gradient1: oklch(0.83 0.15 {values.color1}deg); --gradient2: oklch(0.83 0.15 {values.color2}deg); --image: url('/banner/{values.blendImage}.png')"
></div>

<div class="slider-section">
	<label class="color-label" for="color1">Farbe 1</label>
	<div class="slider">
		<input
			type="range"
			id="color1"
			class="slider-input"
			min="0"
			max="360"
			step="1"
			bind:value={values.color1}
		/>
	</div>
</div>

<div class="slider-section">
	<label class="color-label" for="color2">Farbe 2</label>
	<div class="slider">
		<input
			type="range"
			id="color2"
			class="slider-input"
			min="0"
			max="360"
			step="1"
			bind:value={values.color2}
		/>
	</div>
</div>

<label class="select-label">
	<em class="motif-label">Motiv</em>
	<select bind:value={values.blendImage}>
		<option value="confetti">Konfetti</option>
		<option value="sew">Nähen und Basteln</option>
		<option value="music">Musik</option>
		<option value="community">Community</option>
		<option value="sport">Sport</option>
	</select>
</label>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	p {
		margin: 1rem 0;
		font-size: 93%;
	}

	.gradient {
		height: 3.5rem;
		border-radius: 15px;
		background:
			var(--image),
			linear-gradient(to right in oklab, var(--gradient1, #6fb0c9), var(--gradient2, #db71dd));
		background-size: 120px, auto;
	}

	.slider-section {
		display: flex;
		margin: 1rem 0;
		width: auto;
	}

	.color-label,
	.motif-label {
		width: 5rem;
	}

	.slider {
		height: 1.5rem;
		border-radius: 15px;
		flex-grow: 1;
		background: linear-gradient(
			to right in oklab,
			oklch(0.83 0.25 0deg),
			oklch(0.83 0.25 30deg),
			oklch(0.83 0.25 60deg),
			oklch(0.83 0.25 90deg),
			oklch(0.83 0.25 120deg),
			oklch(0.83 0.25 150deg),
			oklch(0.83 0.25 180deg),
			oklch(0.83 0.25 210deg),
			oklch(0.83 0.25 240deg),
			oklch(0.83 0.25 270deg),
			oklch(0.83 0.25 300deg),
			oklch(0.83 0.25 330deg),
			oklch(0.83 0.25 360deg)
		);
	}

	.slider-input {
		display: block;
		width: 100%;
		margin: 0;
		padding: 0;
		height: 100%;
		opacity: 0.7;
	}

	.select-label {
		display: flex;
		margin: 0.75rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 70px;
		padding: 10px 0;
	}

	select {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: middle;

		&:hover,
		&:focus-visible {
			border-color: var(--color-theme);
			outline: none;
		}
	}
</style>
