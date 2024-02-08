<hr />

<h1>Kontaktiere uns</h1>

<form data-static-form-name="contact">
	<label>
		<div class="label-text">Betreff:</div>
		<input type="text" name="subject" />
	</label>
	<label>
		<div class="label-text">Deine E-Mail:</div>
		<input type="email" name="email" />
		<div class="error">Diese E-Mail-Adresse ist nicht gültig!</div>
	</label>
	<label>
		<div class="label-text">Nachricht:</div>
		<textarea name="message" />
	</label>
	<button type="submit">Absenden</button>
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

		&:invalid:not(:focus) {
			border-color: red;

			+ .error {
				display: block;
			}
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
	}
</style>
