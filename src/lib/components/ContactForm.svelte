<script lang="ts">
	import SubmitButton from '$lib/components/forms/SubmitButton.svelte'

	import ValidatedInput from '$lib/components/forms/ValidatedInput.svelte'
	import { m } from '$lib/paraglide/messages'

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
	action="/api/forms/contact-form"
	onsubmit={event => {
		if (formError) {
			event.preventDefault()
		}
		submitClicked = true
	}}
>
	<ValidatedInput
		type="text"
		label={m.email_subject()}
		name="subject"
		bind:value={subject}
		bind:error={subjectError}
		required={m.email_subject_missing()}
		{submitClicked}
	/>
	<ValidatedInput
		type="email"
		label={m.email_sender()}
		name="email"
		bind:value={email}
		bind:error={emailError}
		required={m.email_sender_missing()}
		{submitClicked}
		hasError={email => (/^\S+@\S+\.\S+$/.test(email) ? false : m.email_sender_invalid())}
	/>
	<ValidatedInput
		type="textarea"
		label={m.email_message()}
		name="body"
		bind:value={content}
		bind:error={contentError}
		required={m.email_message_missing()}
		{submitClicked}
		style="--min-height: 200px"
	/>

	<input type="hidden" name="redirect" value={nextLink} />

	<SubmitButton disabled={submitClicked && !!formError}>{m.actions_send()}</SubmitButton>
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
