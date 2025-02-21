<script lang="ts">
	import { onMount, tick } from 'svelte'

	type State = 'idle' | 'ask-for-consent' | 'loading' | 'loaded' | 'error'

	let st = $state<State>('idle')
	let errorShown = $state(false)

	onMount(() => {
		const hasConsent = localStorage.getItem('consent:instagram')
		errorShown = 'instagram-error-shown' in localStorage
		if (hasConsent) {
			fetchScript()
		} else {
			st = 'ask-for-consent'
		}
	})

	function giveConsent() {
		localStorage.setItem('consent:instagram', 'true')
		fetchScript()
	}

	async function fetchScript() {
		if (window.instgrm) {
			window.instgrm.Embeds.process()
			st = 'loaded'
			return
		}
		st = 'loading'
	}

	function handleScriptLoad() {
		localStorage.removeItem('instagram-error-shown')
		st = 'loaded'
	}

	async function handleScriptError() {
		st = 'error'
		await tick()
		localStorage.setItem('instagram-error-shown', 'true')
	}

	const profile = 'queereszentrumkassel'
	const permaLink = `https://www.instagram.com/${profile}/`
</script>

<div class="iframe-wrapper" class:loaded={st === 'loaded'}>
	<blockquote
		class="instagram-media"
		data-instgrm-permalink={permaLink}
		data-instgrm-version="12"
		style="width: 100%"
	>
		{#if st !== 'error' || errorShown}
			<div class="username">@queereszentrumkassel</div>
		{/if}

		{#if st === 'idle' || (st === 'error' && errorShown)}
			<a id="main_link" href={permaLink} target="_blank" rel="noreferrer noopener">
				Profil auf Instagram ansehen
			</a>
		{:else if st === 'ask-for-consent'}
			<button class="consent-button" onclick={giveConsent}>Profil laden</button>
			<div class="consent">
				Dadurch werden möglicherweise Cookies an Instagram gesendet. Mehr unter
				<a href="/datenschutz">Datenschutz</a>.
			</div>
		{:else if st === 'loading' || st === 'loaded'}
			Lädt...
		{:else if st === 'error'}
			<div class="error">
				Das Profil konnte nicht geladen werden. Möglicherweise wurde es durch den Browser oder einen
				Ad-Blocker blockiert.
			</div>
			<a id="main_link" href={permaLink} target="_blank" rel="noreferrer noopener">
				Profil auf Instagram ansehen
			</a>
		{/if}
	</blockquote>

	{#if st === 'loading'}
		<script
			src="https://www.instagram.com/embed.js"
			onload={handleScriptLoad}
			onerror={handleScriptError}
		></script>
	{/if}
</div>

<style lang="scss">
	@mixin calculated-height {
		min-height: calc(154px + 0.6666666667 * min(22rem, 100vw - 2rem));

		@media (max-width: 1200px) {
			max-width: 44rem;
			min-height: calc(200px + 0.6666666667 * min(22rem, 100vw - 2rem));
		}

		@media (max-width: 517px) {
			min-height: calc(154px + 0.6666666667 * min(22rem, 100vw - 2rem));
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
		color: #666;
		font-size: 1rem;
	}

	.consent {
		font-size: 0.9rem;
		color: #666;
		text-align: center;
		line-height: 1.2;
		text-wrap: balance;

		a {
			color: #444;
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
		background-color: #0085dd;
		text-shadow: 0 1px 2px #0002;
		border: none;
		font-size: 1rem;
		font-family: inherit;

		&:hover,
		&:focus {
			background-color: #0078c8;
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
