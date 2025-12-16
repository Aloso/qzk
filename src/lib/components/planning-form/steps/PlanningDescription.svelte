<script lang="ts">
	import Insert from '$lib/components/Insert.svelte'
	import type { FormValuesDescription } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { m } from '$lib/paraglide/messages'
	import TipTapEditor from '../../TipTapEditor.svelte'

	interface Props {
		values: FormValuesDescription
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()
	let showHelp = $state(false)

	$effect(() => {
		valid = !!values.title && !!values.descHtml && values.descHtml !== '<p></p>'
	})
</script>

<label>
	<em class="required">{m.pf_event_name()}</em>
	<input class="full-width" type="text" bind:value={values.title} required />
</label>
<label for="desc-input">
	<em class="required">{m.pf_description()}</em>
	<TipTapEditor
		id="desc-input"
		bind:htmlValue={values.descHtml}
		bind:showHelp
		headingLevels={[2, 3, 4, 5]}
	/>
</label>
<div class="hint">
	<button type="button" class="a" onclick={() => (showHelp = !showHelp)}>{m.help()}</button>
</div>

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
