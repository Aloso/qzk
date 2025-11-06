<script lang="ts">
	import { onMount } from 'svelte'

	type State = 'idle' | 'ask-for-consent' | 'loaded'

	let st = $state<State>('idle')
	let autplay = $state(false)

	onMount(() => {
		const hasConsent = localStorage.getItem('consent:youtube')
		if (hasConsent) {
			st = 'loaded'
		} else {
			st = 'ask-for-consent'
		}
	})

	function giveConsent() {
		localStorage.setItem('consent:youtube', 'true')
		st = 'loaded'
		autplay = true
	}

	interface Props {
		videoId: string
	}

	const { videoId }: Props = $props()
	const href = `https://www.youtube.com/embed/${videoId}`
</script>

<div class="iframe-wrapper" class:loaded={st === 'loaded'}>
	{#if st === 'idle'}
		<a id="main_link" {href} target="_blank" rel="noreferrer noopener">
			Video auf YouTube ansehen
		</a>
		<div class="consent">&nbsp;</div>
	{:else if st === 'ask-for-consent'}
		<button class="consent-button" onclick={giveConsent}>YouTube-Video laden</button>
		<div class="consent">
			Dadurch werden möglicherweise Cookies an YouTube gesendet. Mehr unter
			<a href="/datenschutz">Datenschutz</a>.
		</div>
	{:else}
		<iframe
			src={autplay ? `${href}?autoplay=1` : href}
			title=""
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			style="width:100%; height: 100%"
		></iframe>
	{/if}
</div>

<style lang="scss">
	.iframe-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-radius: 15px;
		border: 1px solid var(--color-border2);
		margin: 0;
		padding: 1.75rem 2rem;
		gap: 1rem;
		min-height: 2rem;
		transition: min-height 0.5s;
		aspect-ratio: 16 / 9;
		justify-content: center;

		&.loaded {
			padding: 0;
			border: none;
		}

		iframe {
			box-sizing: border-box;
			border-radius: 15px !important;
		}
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
		margin: 0 auto;
		text-decoration: none;

		line-height: 20px;
		padding: 1rem 2rem;
		border-radius: 2rem;
		color: white;
		background-color: #c60000;
		text-shadow: 0 1px 2px #0002;
		border: none;
		font-size: 1.08rem;
		font-family: inherit;

		&:hover,
		&:focus {
			background-color: #b70000;
		}
	}
</style>
