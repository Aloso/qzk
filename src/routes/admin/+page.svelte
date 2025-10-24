<script lang="ts">
	import { goto } from '$app/navigation'
	import { localizeHref } from '$lib/paraglide/runtime'
	import { onMount } from 'svelte'

	let username = $state('')
	let password = $state('')
	let submitted = $state(false)
	let loginFailed = $state(false)

	function submit(e: SubmitEvent) {
		if (username === '' || password === '') {
			e.preventDefault()
			return
		}
	}

	onMount(() => {
		if ('credentials' in localStorage) {
			delete localStorage.credentials
		}

		const url = new URL(window.location.href)

		if (url.searchParams.get('m') === 'loginFailed') {
			loginFailed = true
			delete localStorage.loggedIn
		} else if (url.searchParams.get('m') === 'loginSuccessful') {
			localStorage.loggedIn = 'true'
			goto(localizeHref('/admin/events/drafts/1'), { replaceState: true })
		} else if (url.searchParams.get('m') === 'loggedOut') {
			delete localStorage.loggedIn
		} else if (localStorage.loggedIn) {
			goto(localizeHref('/admin/events/drafts/1'), { replaceState: true })
		}
	})
</script>

<svelte:head>
	<title>Administration - Queeres Zentrum Kassel</title>
</svelte:head>

<form onsubmit={submit} method="POST" action="/admin/login">
	<h1>Admin-Bereich</h1>
	<label>
		Name:
		<input
			name="user"
			type="text"
			bind:value={username}
			class:error={submitted && username === ''}
		/>
	</label>
	<label>
		Passwort:
		<input
			name="password"
			type="password"
			bind:value={password}
			class:error={submitted && password === ''}
		/>
	</label>
	<button type="submit" class:error={submitted && (username === '' || password === '')}>
		Anmelden
	</button>
	{#if loginFailed}
		<p class="error">Login fehlgeschlagen</p>
	{/if}
</form>

<style lang="scss">
	h1 {
		text-align: center;
	}

	form {
		display: block;
		margin: max(0px, 45vh - 500px) auto 0;
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
