<script lang="ts">
	import downloadIcon from '#assets/download.svg'
	import heartIcon from '#assets/heart.svg'
	import lockIcon from '#assets/lock.svg'
	import paypalIcon from '#assets/paypal.svg'
	import sepaIcon from '#assets/sepa.svg'
	import stripeLogo from '#assets/stripe.svg'
	import type { DonationsInfo } from '#lib/contentful/data.ts'
	import { resolve } from '$app/paths'
	import { slide } from 'svelte/transition'
	import TabBar from '../TabBar.svelte'
	import DonationAmountInput from './DonationAmountInput.svelte'

	interface Props {
		tab: 'lastschrift' | 'ueberweisung' | 'paypal' | undefined
		monthly: boolean
		amount: number
		donationsInfo: DonationsInfo['fields']
	}

	let { donationsInfo, tab, monthly, amount = $bindable() }: Props = $props()

	let smallAmount = $state(false)

	$effect(() => {
		if (amount > 0 && amount < 5) {
			const t = setTimeout(() => {
				smallAmount = true
			}, 1200)

			return () => {
				clearTimeout(t)
			}
		} else {
			smallAmount = false
		}
	})

	let customAmount = $state(false)

	function formatEuro(amount: number) {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currencyDisplay: 'name',
			trailingZeroDisplay: 'stripIfInteger',
			currency: 'EUR',
			maximumFractionDigits: 2,
		}).format(amount)
	}
</script>

<div class="donations">
	<a
		class="accordion-button"
		class:active={tab === 'lastschrift'}
		href={tab === 'lastschrift'
			? resolve('/spende/[[tab=donationTab]]', { tab: 'auswahl' })
			: resolve('/spende/[[tab=donationTab]]', { tab: undefined })}
		data-sveltekit-reset="false"
	>
		<img src={sepaIcon} alt="SEPA" class="payment-provider-icon" />
		Lastschrift
	</a>

	{#if tab === 'lastschrift'}
		<section class="accordion-content centered" transition:slide>
			<p>Meine Spende:</p>
			<TabBar
				urls={[
					[resolve('/spende/[[tab=donationTab]]', { tab: undefined }), 'einmalig', 'Einmalig'],
					[resolve('/spende/[[tab=donationTab]]', { tab: 'monatlich' }), 'monatlich', 'Monatlich'],
				]}
				active={monthly ? 'monatlich' : 'einmalig'}
				reset={false}
				pink
			/>
			<DonationAmountInput bind:amount bind:customAmount />

			{#if smallAmount}
				<p class="limit-warning" transition:slide>
					{#if monthly}
						Jede Zahlung kostet uns eine Gebühr. Bei kleinen Beträgen empfehlen wir eine
						<em>jährliche Zahlung</em>, damit möglichst viel bei uns ankommt.<br />
						<span class="divider"></span>
						Du kannst die Spende auch direkt überweisen, auch als Dauerauftrag. Das ist gebührenfrei und
						du kannst einen beliebigen Betrag wählen.<br />
						<span class="divider"></span>
						<a class="button checkout-button primary" class:active={amount > 0} href="/spende">
							Jährlich <b>{formatEuro(Math.max(5, amount * 12))}</b> spenden
						</a>
					{:else}
						Jede Zahlung kostet uns eine Gebühr. Um weniger als 5 Euro zu spenden, nutze am besten
						die direkte Überweisung, damit möglichst viel bei uns ankommt.
					{/if}
				</p>
			{:else}
				<p class="confirmation" class:visible={amount >= 5} transition:slide>
					{monthly ? 'Monatlich' : 'Jetzt einmalig'} <b>{formatEuro(amount)}</b> spenden
				</p>
			{/if}

			<p>
				{#if amount > 0 && amount < 5}
					<a
						class="button checkout-button active"
						class:primary={!monthly}
						href={resolve('/spende/[[tab=donationTab]]', { tab: 'ueberweisung' })}
						data-sveltekit-reset="false"
					>
						Direkt überweisen
					</a>
				{:else}
					<a class="button checkout-button primary" class:active={amount > 0} href="/spende">
						Weiter
					</a>
				{/if}
			</p>
			<p class="security">
				<img src={lockIcon} alt="" width="20px" height="20px" />
				sichere Zahlungsabwicklung mit
				<img alt="Stripe" src={stripeLogo} class="payment-provider-icon" />
			</p>
			<p class="thanks">
				<img src={heartIcon} alt="" width="16px" height="16px" />
				danke, dass du uns unterstützt!
			</p>
		</section>
	{/if}

	<a
		class="accordion-button"
		class:active={tab === 'paypal'}
		href={tab === 'paypal'
			? resolve('/spende/[[tab=donationTab]]', { tab: 'auswahl' })
			: resolve('/spende/[[tab=donationTab]]', { tab: 'paypal' })}
		data-sveltekit-reset="false"
	>
		<img src={paypalIcon} alt="" class="payment-provider-icon" />
		PayPal
	</a>

	{#if tab === 'paypal'}
		<section class="accordion-content centered" transition:slide>
			<p>
				<a
					class="button checkout-button primary active"
					href={donationsInfo.paypalUrl}
					target="_blank"
				>
					Mit PayPal spenden
				</a>
			</p>

			<p class="thanks">
				<img src={heartIcon} alt="" width="16px" height="16px" />
				danke, dass du uns unterstützt!
			</p>
		</section>
	{/if}

	<a
		class="accordion-button"
		class:active={tab === 'ueberweisung'}
		href={tab === 'ueberweisung'
			? resolve('/spende/[[tab=donationTab]]', { tab: 'auswahl' })
			: resolve('/spende/[[tab=donationTab]]', { tab: 'ueberweisung' })}
		data-sveltekit-reset="false"
	>
		Überweisung
	</a>

	{#if tab === 'ueberweisung'}
		<section class="accordion-content" transition:slide>
			<p>
				Überweise den gewünschten Betrag einfach auf unser Konto mit dem Verwendungszweck
				<em>„Spende“</em>. Dafür stellen wir dir gerne eine Spendenbescheinigung aus.
			</p>

			<div class="manualTransfer">
				<table>
					<tbody>
						<tr>
							<td>Kontoinhaber</td>
							<td><b>{donationsInfo.accountOwner}</b></td>
						</tr>
						{#if donationsInfo.iban}
							<tr>
								<td>IBAN</td>
								<td>{donationsInfo.iban}</td>
							</tr>
						{/if}
						{#if donationsInfo.bic}
							<tr>
								<td>BIC</td>
								<td>{donationsInfo.bic}</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			<p>
				Für Spenden bis <strong>300 €</strong> kannst du dir die folgende Spendenbescheinigung
				herunterladen und gemeinsam mit dem Kontoauszug beim Finanzamt einreichen. Bei höheren
				Spendenbeträgen schreibe uns eine E-Mail an
				<a href="mailto:info@queereszentrumkassel.de">info@QueeresZentrumKassel.de</a> oder per
				<a href="/kontakt">Kontaktformular</a> für eine entsprechende Bescheinigung.
			</p>

			<p>
				<a
					class="button flex"
					href="http://assets.ctfassets.net/xjajqvdw74ml/5JA7xY5oaR4v7c3BDBVU4o/242c6d6b8b7f005922759faf330c128c/Vereinfachter_Spendennachweis.pdf"
					download="Vereinfachter_Spendennachweis_QuZ.pdf"
				>
					<img src={downloadIcon} alt="" class="button-icon" />
					Spendenbescheinigung herunterladen
				</a>
			</p>

			<p class="thanks">
				<img src={heartIcon} alt="" width="16px" height="16px" />
				danke, dass du uns unterstützt!
			</p>
		</section>
	{/if}
</div>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;
	@use '../../utils/glitter.scss' as *;

	p {
		margin: 1rem 0;
	}

	.donations {
		max-width: 44rem;
	}

	.button-icon {
		display: inline-block;
		width: 20px;
		vertical-align: middle;
	}

	.accordion-button {
		display: block;
		text-decoration: none;
		border: 2px solid vars.$COLOR_T2;
		background-color: color.adjust(vars.$COLOR_T1, $lightness: 3%);
		padding: 1rem;
		margin-bottom: -2px;
		color: black;
		font-size: 1.15rem;
		transition: 0.2s;

		&::before {
			content: '';
			display: inline-block;
			width: 16px;
			height: 16px;
			background-image: url('../../../assets/arrow.svg');
			background-size: 16px;
			transform: rotate(-90deg);
			opacity: 0.75;
			margin-right: 0.75rem;
			vertical-align: middle;
			transition: 0.2s;
		}

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T1;
		}

		&.active {
			font-weight: 600;
			background-color: color.adjust(vars.$COLOR_T1, $lightness: -5%);

			&::before {
				transform: rotate(0);
				opacity: 1;
			}
		}

		&:first-child {
			border-radius: 1rem 1rem 0 0;
		}

		&:last-child {
			border-radius: 0 0 1rem 1rem;
		}
	}

	.accordion-content {
		display: flex;
		flex-direction: column;
		background-color: white;
		background-image: linear-gradient(
			-20deg,
			color.adjust(vars.$COLOR_T1, $lightness: 3%) 0%,
			white 70%,
			white 100%
		);
		border: 2px solid vars.$COLOR_T2;
		margin-bottom: -2px;
		padding: 1.5rem;
		object-position: top;
		object-fit: none;
		overflow: clip;

		&:first-child {
			border-radius: 1rem 1rem 0 0;
		}

		&:last-child {
			border-radius: 0 0 1rem 1rem;
		}

		> :global(*) {
			margin-block: 0 1rem;
		}

		> :last-child {
			margin-bottom: 0;
		}

		&.centered {
			text-align: center;

			:global(.tabs) {
				justify-content: center;
				margin: 0 0 1rem 0;
			}
		}

		@media (max-width: 540px) {
			padding: 1.2rem;

			p {
				font-size: 1.08rem;
				line-height: 140%;
			}

			.manualTransfer {
				box-sizing: border-box;
				font-size: 1.1rem;
				width: 100%;

				table {
					display: block;
				}
				tbody {
					display: block;
				}
				tr {
					display: block;
				}
				td {
					display: block;
				}
				td:first-child {
					font-size: 0.9rem;
					padding-bottom: 0;
				}
				td:last-child {
					padding-top: 0.25rem;
				}
			}
		}
	}

	.button {
		display: inline-block;
		text-decoration: none;
		background-color: color.adjust(vars.$COLOR_T4, $lightness: 10%);
		color: white;
		padding: 0.4rem 0.75rem;
		border-radius: 0.5rem;
		transition: 0.2s background-color;

		&.flex {
			display: inline-flex;
			gap: 0.5rem;
		}

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T4;
		}
	}

	.payment-provider-icon {
		height: 1em;
		vertical-align: middle;
	}

	.manualTransfer {
		display: block;
		width: fit-content;
		max-width: 100%;
		padding: 0.5rem;
		font-size: 1.15rem;
		border: 2px solid #ccc;
		border-radius: 1rem;

		table {
			display: table;
			width: auto;
			border-collapse: collapse;
		}

		td {
			padding: 0.5rem;
		}
	}

	.confirmation {
		font-size: 0.9rem;
		line-height: 1.2rem;
		visibility: hidden;

		&.visible {
			visibility: visible;
		}
	}

	.limit-warning {
		line-height: 1.5em;

		.divider {
			display: block;
			height: 0.75em;
		}
	}

	.checkout-button {
		line-height: 1.7;

		&.primary {
			text-shadow:
				1px 1px 3px vars.$COLOR_T4,
				-1px -1px 3px vars.$COLOR_T4;

			@include glitter($base-brightness: 0.2, $maximum-brightness: 0.8);
		}

		&:not(.primary) {
			color: vars.$COLOR_T4;
			background-color: white;

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
			}
		}

		&:not(.active) {
			background-color: #bcbcbc;
			text-shadow: none;
			color: #555;
		}
	}

	p.security,
	p.thanks {
		font-size: 0.9rem;

		img {
			vertical-align: -3px;
		}
	}

	@media (max-width: 540px) {
		p.confirmation,
		p.security,
		p.thanks {
			font-size: 0.9rem;
		}
	}
</style>
