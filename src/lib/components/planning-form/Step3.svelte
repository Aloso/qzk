<script lang="ts">
	import type { FormValuesStep3 } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		values: FormValuesStep3
		valid: boolean
	}

	let { values, valid }: Props = $props()

	$effect(() => {
		valid = true
	})
</script>

<div class="section-title">Organisator*innen</div>
<p>Kontaktdaten der organisierenden Person/Gruppe</p>
<p class="optional">Freiwillige Angaben</p>

<label>
	<em>Name(n)</em>
	<input type="text" bind:value={values.organizerName} />
</label>
<label>
	<em>E-Mail</em>
	<input type="text" bind:value={values.organizerEmail} />
</label>
<label>
	<em>Telefon</em>
	<input type="text" bind:value={values.organizerPhone} />
</label>
<label>
	<em>Website</em>
	<input type="text" bind:value={values.organizerWebsite} />
</label>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']) {
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
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	select,
	textarea,
	input[type='text'] {
		box-sizing: border-box;
		width: calc(100% - 150px);

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	.full-width {
		width: 100% !important;
	}

	label {
		display: block;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	.radio-label,
	.checkbox-label {
		margin: 0.5rem 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 140px;
		padding: 10px 0;

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}

	p {
		margin: 1rem 0;
		font-size: 93%;

		&.optional {
			color: green;
		}
	}
</style>
