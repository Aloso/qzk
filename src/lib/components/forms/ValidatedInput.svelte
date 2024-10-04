<script lang="ts">
	import FormError from './FormError.svelte'

	interface Props {
		label: string
		type: 'text' | 'email' | 'password' | 'textarea'
		name?: string
		value: string
		required?: string
		error: string | false
		hasError?: (input: string) => string | false
		submitClicked?: boolean
		style?: string
	}

	let {
		label,
		type,
		name,
		value = $bindable(),
		required,
		error = $bindable(),
		hasError,
		submitClicked,
		style,
	}: Props = $props()

	let focused = $state(false)
	let customError = $state<string | false>(false)
	let errorVisible = $derived((submitClicked && error) || (value !== '' && !focused && customError))

	$effect(() => {
		if (required && value === '') {
			error = required
		} else if (hasError) {
			error = hasError(value)
			customError = error
		} else {
			error = false
		}
	})
</script>

<label>
	<div class="label-text">{label}</div>

	{#if type === 'textarea'}
		<textarea
			{name}
			{value}
			class:invalid={errorVisible}
			{style}
			oninput={e => (value = e.currentTarget.value)}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		></textarea>
	{:else}
		<input
			{type}
			{name}
			{value}
			class:invalid={errorVisible}
			{style}
			oninput={e => (value = e.currentTarget.value)}
			onfocus={() => (focused = true)}
			onblur={() => (focused = false)}
		/>
	{/if}

	<FormError visible={!!errorVisible}>{error}</FormError>
</label>

<style lang="scss">
	label {
		display: block;
		margin: 1.5rem 0 0 0;
		&:first-child {
			margin-top: 0;
		}
	}
	.label-text {
		display: block;
		margin: 0 0 0.5rem;
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
		min-height: var(--min-height, 160px);
	}
</style>
