<script lang="ts">
	import Insert from '$lib/components/Insert.svelte'
	import type { FormValuesDescription } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { m } from '$lib/paraglide/messages'
	import { translate } from '$lib/translation'
	import TipTapEditor from '../../TipTapEditor.svelte'

	interface Props {
		values: FormValuesDescription
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()
	let lastChangedLanguage = $state<'de' | 'en'>('de')
	let showHelp = $state(false)
	let translationError = $state<string>()
	let deEditor = $state<TipTapEditor>()
	let enEditor = $state<TipTapEditor>()

	let deValid = $derived(!!values.titleDe && isDescriptionValid(values.descDe))
	let enValid = !values.en || (!!values.titleEn && isDescriptionValid(values.descEn))
	let sourceLang = $derived(lastChangedLanguage === 'de' || !enValid ? 'de' : 'en')
	let translationButtonActive = $derived.by(() => {
		if (sourceLang === 'de') return deValid && values.descDe.length > 12
		else return enValid && values.descEn.length > 12
	})

	$effect(() => {
		valid = deValid && enValid
	})
	$effect(() => {
		values.titleDe
		values.descDe
		lastChangedLanguage = 'de'
	})
	$effect(() => {
		values.titleEn
		values.descEn
		lastChangedLanguage = 'en'
	})
	$inspect(values.titleEn)

	function isDescriptionValid(desc?: string) {
		return !!desc && desc !== '<p></p>'
	}

	async function translateFields() {
		const lang = sourceLang
		const targetLang = lang === 'de' ? 'en' : 'de'
		const results = await translate(
			[
				{ text: lang === 'de' ? values.titleDe : values.titleEn },
				{ text: lang === 'de' ? values.descDe : values.descEn, html: true },
			],
			lang,
			targetLang,
		)
		if (typeof results === 'string') {
			switch (results) {
				case 'TOO_MANY_REQUESTS':
					translationError = m.translate_error_too_many_requests()
					return
				case 'QUOTA_EXCEEDED':
					translationError = m.translate_error_quota_exceeded()
					return
				case 'CONTENT_TOO_LARGE':
					translationError = m.translate_error_content_too_large()
					return
				case 'INTERNAL':
				default:
					translationError = m.translate_error_internal()
					return
			}
		}

		if (targetLang === 'en') {
			values.titleEn = results[0].text
			values.descEn = results[1].text
			enEditor?.setHtmlValue(results[1].text)
		} else {
			values.titleDe = results[0].text
			values.descDe = results[1].text
			deEditor?.setHtmlValue(results[1].text)
		}
	}
</script>

<label>
	<em class="required">{m.pf_event_name()}</em>
	<input class="full-width" type="text" bind:value={values.titleDe} required />
</label>
<label for="desc-input-de">
	<em class="required">{m.pf_description()}</em>
	<TipTapEditor
		id="desc-input-de"
		bind:this={deEditor}
		bind:htmlValue={values.descDe}
		bind:showHelp
		headingLevels={[2, 3, 4, 5]}
	/>
</label>
<div class="hint">
	<button type="button" class="a" onclick={() => (showHelp = !showHelp)}>{m.help()}</button>
</div>

<div class="translation-bar">
	<label class="checkbox-label">
		<input type="checkbox" bind:checked={values.en} />
		{m.pf_english_version()}
	</label>

	{#if values.en}
		<button class="translate" onclick={translateFields} disabled={!translationButtonActive}>
			{m.actions_translate()}
			<div class="translate-with">{m.actions_translate_with()}</div>
		</button>
	{/if}
</div>

{#if translationError}
	<div class="translation-error">
		<button class="close-t-error" onclick={() => (translationError = undefined)}>×</button>
		{@html translationError}
	</div>
{/if}

{#if values.en}
	<label>
		<em class="required">{m.pf_event_name_en()}</em>
		<input class="full-width" type="text" bind:value={values.titleEn} required />
	</label>
	<label for="desc-input-en">
		<em class="required">{m.pf_description_en()}</em>
		<TipTapEditor
			id="desc-input-en"
			bind:this={enEditor}
			bind:htmlValue={values.descEn}
			bind:showHelp
			headingLevels={[2, 3, 4, 5]}
		/>
	</label>
{/if}

{#if !professional}
	<Insert template={m.pf_description_help()}>
		{#snippet placeholder(type, content)}
			{#if type === 'p'}
				<p>{content}</p>
			{:else if type === 'ul'}
				<ul>
					{#each content!.split('|') as item, i (i)}
						<li>{item}</li>
					{/each}
				</ul>
			{/if}
		{/snippet}
	</Insert>
{/if}

<style lang="scss">
	input:not([type='checkbox']),
	:global(#desc-input-de),
	:global(#desc-input-en) {
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

	input:not([type='checkbox']),
	:global(#desc-input-de),
	:global(#desc-input-en) {
		box-sizing: border-box;
		width: 100%;
		color: black;
	}

	:global(#desc-input-de),
	:global(#desc-input-en) {
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

	.translation-bar {
		min-height: 2.3em;
		display: flex;
		justify-content: space-between;
	}

	.checkbox-label {
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.25em;
	}

	.translate {
		font: inherit;
		border: none;
		border-radius: 0.5rem;
		background-color: var(--color-theme);
		color: white;
		padding: 0.2rem 0.67rem 0.1rem;
		text-align: right;
		transition: background-color 0.2s;

		&[disabled] {
			opacity: 0.7;
		}

		&:not([disabled]):hover,
		&:not([disabled]):active {
			background-color: var(--color-link);
			cursor: pointer;
		}

		.translate-with {
			font-size: 0.7em;
		}
	}

	.translation-error {
		margin: 1rem 0 0 0;
		background-color: #ff00001f;
		border-radius: 0.4rem;
		padding: 0.7rem 0.75rem;
		font-size: 1rem;

		button {
			float: right;
			border: none;
			padding: 0;
			margin: -0.3rem -0.35rem -0.3rem 0;
			width: 1.8rem;
			height: 1.8rem;
			font: inherit;
			background-color: #fff8;
			border-radius: 0.2rem;

			&:hover {
				background-color: #fff;
			}
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
