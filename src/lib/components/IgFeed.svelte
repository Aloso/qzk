<script lang="ts">
	import { onMount } from 'svelte'

	type State = 'idle' | 'ask-for-consent' | 'loading' | 'loaded' | 'error'

	let state = $state<State>('idle')

	onMount(() => {
		const hasConsent = localStorage.getItem('consent:instagram')
		if (hasConsent) {
			fetchScript()
		} else {
			state = 'ask-for-consent'
		}
	})

	function giveConsent() {
		localStorage.setItem('consent:instagram', 'true')
		fetchScript()
	}

	async function fetchScript() {
		state = 'loading'

		let res: Response
		try {
			res = await fetch('https://www.instagram.com/embed.js')
		} catch {
			state = 'error'
			return
		}

		await res.text()
		state = 'loaded'
	}

	const profile = 'queereszentrumkassel'
	const permaLink = `https://www.instagram.com/${profile}/`
	const loaded = $derived(state === 'loaded')
</script>

<h2>Instagram</h2>

<div class="iframe-wrapper" class:loaded>
	<blockquote
		class="instagram-media"
		data-instgrm-permalink={permaLink}
		data-instgrm-version="12"
		style="width: 100%"
	>
		{#if state !== 'error'}
			<div class="username">@queereszentrumkassel</div>
		{/if}

		{#if state === 'idle'}
			<a id="main_link" href={permaLink} target="_blank" rel="noreferrer noopener">
				Profil auf Instagram ansehen
			</a>
		{:else if state === 'ask-for-consent'}
			<button class="consent-button" on:click={giveConsent}>Profil laden</button>
			<div class="consent">
				Dadurch werden Daten an Instagram übermittelt. Mehr unter
				<a href="/datenschutz">Datenschutz</a>.
			</div>
		{:else if state === 'loading' || state === 'loaded'}
			Lädt...
		{:else if state === 'error'}
			<div class="error">
				Das Profil konnte nicht geladen werden. Möglicherweise wurde es durch den Browser oder einen
				Ad-Blocker blockiert.
			</div>
			<a id="main_link" href={permaLink} target="_blank" rel="noreferrer noopener">
				Profil auf Instagram ansehen
			</a>
		{/if}
	</blockquote>

	{#if loaded}
		<script src="https://www.instagram.com/embed.js"></script>
	{/if}
</div>

<style lang="scss">
	@mixin calculated-height {
		min-height: calc(200px + 0.6666666667 * min(43rem, 100vw - 2rem));

		@media (max-width: 517px) {
			min-height: calc(154px + 0.6666666667 * min(43rem, 100vw - 2rem));
		}
	}

	blockquote {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-radius: 15px;
		border: 1px solid #dbdbdb;
		margin: 0;
		padding: 1.75rem 2rem;
		gap: 1rem;
		min-height: 2rem;
		transition: min-height 0.5s;

		.loaded & {
			@include calculated-height();
		}
	}

	.username {
		color: #777;
		font-size: 1rem;
	}

	.consent {
		font-size: 0.9rem;
		color: #888;
		text-align: center;
		line-height: 1.2;
		text-wrap: balance;

		a {
			color: #555;
			padding: 5px 0;
			margin: -5px 0;
			text-decoration-color: #777;
			text-decoration-thickness: 1px;
			text-underline-offset: 2px;

			&:hover,
			&:focus {
				color: var(--color-link);
				text-decoration-color: var(--color-link);
			}
		}
	}

	.consent-button,
	#main_link {
		display: block;
		text-align: center;
		text-decoration: none;

		height: 40px;
		line-height: 40px;
		border-radius: 8px;
		color: white;
		background-color: #0095f6;
		border: none;
		font-size: 1rem;
		font-family: inherit;

		&:hover,
		&:focus {
			background-color: #0082d9;
		}
	}

	.error {
		color: red;
		font-size: 1rem;
		text-align: center;
	}

	.iframe-wrapper {
		position: relative;

		:global(iframe) {
			box-sizing: border-box;
			border-radius: 15px !important;

			@include calculated-height();
		}
	}
</style>
