<script lang="ts">
	import Checkbox from '$lib/components/forms/Checkbox.svelte'
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte'
	import ValidatedInput from '$lib/components/forms/ValidatedInput.svelte'

	let email = $state('')
	let checkbox = $state(false)

	let emailError = $state<string | false>(false)
	let formError = $derived(emailError || !checkbox)

	let submitClicked = $state(false)
</script>

<form
	method="POST"
	action="https://3a21c768.sibforms.com/serve/MUIFADgcRngDHEOQekOVRjyGk_GWH_ZxhN5vaZBwEv35Twecv86LJQjqOgJAWwOt8LuGKlOAcdryM5r4OSmtAxYCT4AXmofrepNoQDgmE9hoy__Qte3j2l15Oe0NURXeNBONlgbg_PXRYZTvc1PpHqPtS797KOFZYiw6FMBndP0ThMf9UfuqnbGVujVfIxRhIJVhn4c9hEywsOzJ"
	onsubmit={event => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<ValidatedInput
		type="email"
		label="Deine E-Mail-Adresse:"
		name="EMAIL"
		bind:value={email}
		bind:error={emailError}
		required="Bitte Deine E-Mail-Adresse eingeben"
		{submitClicked}
		hasError={email =>
			/^\S+@\S+\.\S+$/.test(email) ? false : 'Die E-Mail-Adresse ist nicht gültig!'}
	/>

	<Checkbox
		name="OPT_IN"
		value="1"
		bind:checked={checkbox}
		required="Verpflichtend"
		{submitClicked}
	>
		Ich stimme dem Versand von E-Mails zu und akzeptiere die Datenschutzvereinbarung.
	</Checkbox>

	<SubmitButton disabled={submitClicked && !!formError}>Newsletter abonnieren</SubmitButton>

	<input type="text" name="email_address_check" value="" aria-hidden="true" class="input--hidden" />
	<input type="hidden" name="locale" value="en" />
	<input type="hidden" name="html_type" value="simple" />
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

	.input--hidden {
		display: none;
	}
</style>
