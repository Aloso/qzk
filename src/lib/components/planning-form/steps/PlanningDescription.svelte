<script lang="ts">
	import type { FormValuesDescription } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import TipTapEditor from '../../TipTapEditor.svelte'

	interface Props {
		values: FormValuesDescription
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()
	let showHelp = $state(false)

	$effect(() => {
		valid = !!values.titleDe && !!values.descDe && values.descDe !== '<p></p>'
	})
</script>

<label>
	<em class="required">Name der Veranstaltung</em>
	<input class="full-width" type="text" bind:value={values.titleDe} required />
</label>
<label for="desc-input">
	<em class="required">Beschreibung</em>
	<TipTapEditor
		id="desc-input"
		bind:htmlValue={values.descDe}
		bind:showHelp
		headingLevels={[2, 3, 4, 5]}
	/>
</label>
<div class="hint">
	<button type="button" class="a" onclick={() => (showHelp = !showHelp)}>Hilfe</button>
</div>

{#if !professional}
	<p>
		Bitte gib eine aussagekräftige Beschreibung an. Sie sollte alle wichtigen Fragen beantworten,
		zum Beispiel:
	</p>
	<ul>
		<li>Was erwartet mich bei der Veranstaltung?</li>
		<li>Wer kann teilnehmen? Gibt es eine Altersgrenze?</li>
		<li>Muss ich mich dafür vorbereiten oder etwas mitbringen?</li>
	</ul>
	<p>Ort und Zeit müssen <b>nicht</b> in der Beschreibung stehen.</p>
{/if}

<style lang="scss">
	input,
	:global(#desc-input) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		transition: border-color 0.2s;
		vertical-align: middle;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	input,
	:global(#desc-input) {
		box-sizing: border-box;
		width: 100%;
		color: black;
	}

	:global(#desc-input) {
		padding-top: 0;
		padding-bottom: 0;
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
		padding: 10px 0;
	}

	.hint {
		opacity: 0.6;
		font-size: 0.85rem;
		text-align: right;
		margin-top: -0.8rem;
		margin-bottom: 1rem;

		&:hover,
		&:focus-within {
			opacity: 1;
		}
	}

	p,
	ul {
		font-size: 1rem;
	}
</style>
