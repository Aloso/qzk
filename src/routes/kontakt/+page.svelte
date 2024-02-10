<script lang="ts">
	import { page } from '$app/stores'
	import ValidatedInput from '$lib/components/ValidatedInput.svelte'
	import SubmitButton from '$lib/components/SubmitButton.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import RichText from '$lib/components/RichText.svelte'
	import type { ItemData, StaticPage } from '$lib/data'

	let subject = $state('')
	let email = $state('')
	let content = $state('')

	let subjectError = $state<string | false>(false)
	let emailError = $state<string | false>(false)
	let contentError = $state<string | false>(false)
	let formError = $derived(subjectError || emailError || contentError)

	let submitClicked = $state(false)

	let { data } = $props<ItemData<StaticPage>>()
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.fields?.content} width={900} />
</section>

<hr />

<h1>Kontaktiere uns</h1>

<form
	method="POST"
	action="https://formsubmit.co/info@queereszentrumkassel.de"
	on:submit={(event) => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<ValidatedInput
		type="text"
		label="Betreff:"
		name="_subject"
		bind:value={subject}
		bind:error={subjectError}
		required="Bitte Betreff eingeben"
		{submitClicked}
	/>
	<ValidatedInput
		type="email"
		label="Deine E-Mail:"
		name="email"
		bind:value={email}
		bind:error={emailError}
		required="Bitte Deine E-Mail-Adresse eingeben"
		{submitClicked}
		hasError={(email) =>
			/^\S+@\S+\.\S+$/.test(email) ? false : 'Diese E-Mail-Adresse ist nicht gültig!'}
	/>
	<ValidatedInput
		type="textarea"
		label="Nachricht:"
		name="content"
		bind:value={content}
		bind:error={contentError}
		required="Bitte Nachricht eingeben"
		{submitClicked}
		style="--min-height: 200px"
	/>

	<input type="hidden" name="_template" value="box" />
	<input type="hidden" name="_captcha" value="false" />
	<input
		type="hidden"
		name="_next"
		value="https://{$page.url
			.host}/email/gesendet?context=CONTACT_FORM&backLink={encodeURIComponent($page.url.href)}"
	/>

	<SubmitButton disabled={submitClicked && !!formError}>Absenden</SubmitButton>
</form>

<style lang="scss">
	form {
		background-color: #eee;
		border: 2px solid #ddd;
		border-radius: 30px;
		padding: 30px;
		max-width: 700px;
	}
</style>
