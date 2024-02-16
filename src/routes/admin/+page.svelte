<script lang="ts">
	import { goto } from '$app/navigation'
	import { fetchAllDrafts } from '$lib/events/draftApi'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'
	import { onMount } from 'svelte'

	let username = $state('')
	let password = $state('')
	let submitted = $state(false)
	let loginFailed = $state(false)
	let loaded = $state(false)
	const credentials = createAdminCredentials()

	function submit() {
		submitted = true
		if (username === '' || password === '') return
		localStorage.setItem('credentials', JSON.stringify({ username, password }))
		actualSubmit(username, password)
	}

	async function actualSubmit(username: string, password: string) {
		try {
			await fetchAllDrafts({ username, password }, 0, 1)
			goto('/admin/events', { replaceState: true })
		} catch {
			loginFailed = true
			loaded = true
		}
	}

	onMount(() => {
		if (credentials.auth) {
			const { username, password } = credentials.auth
			actualSubmit(username, password)
		} else {
			loaded = true
		}
	})
</script>

<form on:submit|preventDefault={submit} class:hidden={!loaded}>
	<h1>Admin-Bereich</h1>
	<label>
		Name:
		<input type="text" bind:value={username} class:error={submitted && username === ''} />
	</label>
	<label>
		Passwort:
		<input type="password" bind:value={password} class:error={submitted && password === ''} />
	</label>
	<button type="submit" class:error={submitted && (username === '' || password === '')}>
		Anmelden
	</button>
	{#if loginFailed}
		<p class="error">Login fehlgeschlagen</p>
	{/if}
</form>

<style lang="scss">
	.hidden {
		display: none;
	}

	h1 {
		text-align: center;
	}

	form {
		display: block;
		max-width: 400px;
		margin: 10vh auto;
	}

	label {
		display: block;
		margin: 1rem 0;
	}

	input {
		display: block;
		box-sizing: border-box;
		width: 100%;
		margin: 0.5rem 0 0 0;
		background-color: white;
		border: 2px solid #aaa;
		padding: 0.5rem 1rem;
		border-radius: 10px;
		font: inherit;
		transition: 0.2s;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}

		&.error {
			border-color: red;
		}
	}

	button {
		display: block;
		background-color: var(--color-theme);
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 10px;
		font: inherit;
		transition: 0.2s;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}
	}

	.error {
		color: red;
	}
</style>
