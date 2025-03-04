<script lang="ts">
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte'

	import ValidatedInput from '$lib/components/forms/ValidatedInput.svelte'

	let subject = $state('')
	let email = $state('')
	let content = $state('')

	let subjectError = $state<string | false>(false)
	let emailError = $state<string | false>(false)
	let contentError = $state<string | false>(false)
	let formError = $derived(subjectError || emailError || contentError)

	let submitClicked = $state(false)

	let { nextLink }: { nextLink: string } = $props()
</script>

<form
	method="POST"
	action="https://formsubmit.co/info@queereszentrumkassel.de"
	onsubmit={event => {
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
		hasError={email =>
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
	<input type="hidden" name="_next" value={nextLink} />

	<SubmitButton disabled={submitClicked && !!formError}>Absenden</SubmitButton>
</form>

<style lang="scss">
	form {
		background-color: #eee;
		border: 2px solid #ddd;
		border-radius: 30px;
		padding: 30px;
		max-width: 44rem;
		box-sizing: border-box;

		@media (max-width: 38rem) {
			width: auto;
			margin-left: -1rem;
			margin-right: -1rem;
			border-left-width: 0;
			border-right-width: 0;
			border-radius: 0;
		}
	}
</style>
