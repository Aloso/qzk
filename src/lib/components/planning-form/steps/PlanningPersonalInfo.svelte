<script lang="ts">
	import type {
		FormValuesOrganisator,
		FormValuesPersonalInfo,
	} from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { localizeHref } from '$lib/paraglide/runtime'
	import { onMount } from 'svelte'

	interface Props {
		values: FormValuesPersonalInfo & FormValuesOrganisator
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()

	onMount(() => {
		if (values.organizerName && !values.yourName) {
			values.yourName = values.organizerName
		}
		if (values.organizerEmail && !values.yourEmail) {
			values.yourEmail = values.organizerEmail
		}
	})

	$effect(() => {
		valid =
			!!values.yourName && !!values.yourEmail && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(values.yourEmail)
	})
</script>

{#if !professional}
	<p class="important">
		Durch das Absenden stimmst du der Veröffentlichung der angegebenen Daten zu. Mehr Infos findest
		du in der <a href={localizeHref('/datenschutz')} target="_blank">Datenschutzerklärung</a>.
	</p>
{/if}

<div class="section-title">Persönliche Infos</div>
<p>Diese Daten werden nicht veröffentlicht.</p>
<label>
	<em class="required">Dein Name</em>
	<input type="text" bind:value={values.yourName} required />
</label>
<label>
	<em class="required">Deine E-Mail</em>
	<input type="text" bind:value={values.yourEmail} required />
</label>

{#if professional}
	<div class="section-title">Notizen (nicht öffentlich)</div>
	<textarea bind:value={values.orgaNotes} class="full-width"></textarea>
{/if}

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

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

	textarea,
	input[type='text'] {
		box-sizing: border-box;
		width: calc(100% - 7.4rem);

		@media (max-width: 33rem) {
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

	em {
		font-style: normal;
		display: inline-block;
		width: 7rem;
		padding: 10px 0;

		@media (max-width: 33rem) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}

	p:not(.important) {
		margin: 1rem 0;
		font-size: 93%;
	}
</style>
