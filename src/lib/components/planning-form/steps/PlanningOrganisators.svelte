<script lang="ts">
	import type { FormValuesOrganisator } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		values: FormValuesOrganisator
		valid: boolean
	}

	let { values = $bindable(), valid = $bindable() }: Props = $props()

	$effect(() => {
		valid = values.organizerWebsite === '' || /^https?:\/\//.test(values.organizerWebsite)
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
	{#if !valid}
		<div class="error">Muss mit <b>https://</b> oder <b>http://</b> beginnen</div>
	{/if}
</label>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

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

	input[type='text'] {
		box-sizing: border-box;
		width: calc(100% - 5.4rem);
	}

	label {
		display: block;
		margin: 0.75rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 5rem;
		padding: 10px 0;
	}

	p {
		margin: 1rem 0;
		font-size: 93%;

		&.optional {
			color: green;
		}
	}

	.error {
		color: darkred;
		font-size: 93%;
	}
</style>
