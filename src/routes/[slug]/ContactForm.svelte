<script lang="ts">
	import { page } from '$app/stores'

	let subject = $state('')
	let email = $state('')
	let content = $state('')
	let emailFocused = $state(false)

	let dirty = $state(false)
	let emailValid = $derived(/^\S+@\S+\.\S+$/.test(email))

	let subjectError = $derived(dirty && subject === '')
	let emailError = $derived(
		(email && (dirty || !emailFocused) && !emailValid) || (dirty && email === ''),
	)
	let contentError = $derived(dirty && content === '')

	let formError = $derived(subject === '' || !emailValid || content === '')
</script>

<hr />

<h1>Kontaktiere uns</h1>

<form method="POST" action="https://formsubmit.co/ludwig.stecher@gmx.de">
	<label>
		<div class="label-text">Betreff:</div>
		<input type="text" name="_subject" required bind:value={subject} class:invalid={subjectError} />
		<div class="error" class:visible={subjectError}>Bitte Betreff eingeben</div>
	</label>

	<label>
		<div class="label-text">Deine E-Mail:</div>
		<input
			type="email"
			name="email"
			required
			bind:value={email}
			on:focus={() => (emailFocused = true)}
			on:blur={() => (emailFocused = false)}
			class:invalid={emailError}
		/>
		<div class="error" class:visible={email && !emailValid && emailError}>
			Diese E-Mail-Adresse ist nicht gültig!
		</div>
		<div class="error" class:visible={dirty && email === ''}>
			Bitte Deine E-Mail-Adresse eingeben
		</div>
	</label>

	<label>
		<div class="label-text">Nachricht:</div>
		<textarea name="content" required bind:value={content} class:invalid={contentError} />
		<div class="error" class:visible={contentError}>Bitte Nachricht eingeben</div>
	</label>

	<input type="hidden" name="_template" value="box" />
	<input type="hidden" name="_captcha" value="false" />
	<input
		type="hidden"
		name="_next"
		value="https://{$page.url
			.host}/email/gesendet?context=CONTACT_FORM&backLink={encodeURIComponent($page.url.href)}"
	/>

	<button
		type="submit"
		class:disabled={dirty && formError}
		on:click={(event) => {
			if (formError) {
				event.preventDefault()
				event.stopPropagation()
			}
			dirty = true
		}}>Absenden</button
	>
</form>

<style lang="scss">
	form {
		background-color: #eee;
		border: 2px solid #ddd;
		border-radius: 30px;
		padding: 30px;
		max-width: 700px;
	}

	.label-text {
		display: block;
		margin: 1.5rem 0 0.5rem;

		label:first-child & {
			margin-top: 0;
		}
	}

	input,
	textarea {
		box-sizing: border-box;
		border: 2px solid #aaa;
		border-radius: 15px;
		background-color: white;
		font: inherit;
		padding: 15px;
		transition: border-color 0.2s;
		width: 100%;
		resize: vertical;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}

		&.invalid {
			border-color: red;
		}
	}

	textarea {
		min-height: 200px;
	}

	.error {
		display: none;
		font-size: 0.9rem;
		margin: 0.5rem 0 1.5rem;
		color: red;

		&.visible {
			display: block;
		}
	}

	button {
		background-color: var(--color-theme);
		color: white;
		padding: 15px 20px;
		font: inherit;
		color: white;
		border: 2px solid var(--color-theme);
		border-radius: 15px;
		margin: 1.5rem 0 0 0;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}

		&.disabled {
			background-color: #717171;
			border-color: #717171;
		}
	}
</style>
