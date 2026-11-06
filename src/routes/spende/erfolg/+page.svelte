<script lang="ts">
	import { m } from '#lib/paraglide/messages.js'
	import { localizeHref } from '#lib/paraglide/runtime.js'
	import heartIcon from '../../../assets/heart.svg'
	import type { DonationResult } from './+page.server'

	let { data }: { data: DonationResult } = $props()
</script>

<svelte:head>
	<title>{m.donated_title()} | Queeres Zentrum Kassel</title>
</svelte:head>

<section>
	<h1>Vielen <img alt="herz" src={heartIcon} class="heart" />-lichen Dank für deine Spende.</h1>
	{#if data.interval === 'once'}
		<p>
			Du hast gerade etwas dazu beigetragen, das Queere Zentrum zu erhalten und mit Leben zu füllen.
		</p>
	{:else}
		<p>Ab sofort trägst du dazu bei, das Queere Zentrum zu erhalten und mit Leben zu füllen.</p>
	{/if}

	{#if data.interval !== 'once'}
		<p>
			Deine Spende wird <b>{data.interval === 'month' ? 'monatlich' : 'jährlich'}</b> abgebucht. Du
			kannst sie jederzeit kündigen, indem du uns eine E-Mail an
			<a href="mailto:spenden@queereszentrumkassel.de">spenden@QueeresZentrumKassel.de</a> schickst.
			Du kannst auch das <a href={localizeHref('/kontakt')}>Kontaktformular</a> nutzen.
		</p>
	{/if}

	<h2>Hol dir deinen Glitzer-Sticker</h2>

	{#if data.stickerOrdered}
		<p>Du hast bereits einen Sticker bestellt.</p>
	{:else}
		<p>Als Dankeschön bekommst du <b>kostenlos</b> einen coolen Glitzer-Sticker!</p>
		<p class="warning">Diese Funktion ist noch in Arbeit.</p>
	{/if}

	<h2>Spendenbescheinigung</h2>
	<p>Wir schicken dir am Ende des Jahres eine Spendenbescheinigung per E-Mail.</p>
</section>

<style lang="scss">
	section {
		max-width: 44rem;
		margin: 0 auto;
	}

	.heart {
		height: 1em;
		vertical-align: -0.1em;
	}

	.warning {
		border: 2px solid #d8c245;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
	}
</style>
