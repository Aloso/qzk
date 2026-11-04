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
	import ReactiveTabBar from '../ReactiveTabBar.svelte'
	import DonationAmountInput from './DonationAmountInput.svelte'

	interface Props {
		tab: 'lastschrift' | 'ueberweisung' | 'paypal' | undefined
		amount: number | null
		donationsInfo: DonationsInfo['fields']
	}

	let { donationsInfo, tab, amount = $bindable() }: Props = $props()

	let monthly = $state(true)
	let smallAmount = $state(false)

	$effect(() => {
		const stored = localStorage.getItem('donation-info')
		if (stored) {
			try {
				const data: { monthly: boolean; amount: number } = JSON.parse(stored)
				const prevAmount = Number(data.amount)
				if (!Number.isNaN(prevAmount) && prevAmount >= 1 && Math.round(prevAmount) === prevAmount) {
					amount = prevAmount
				}
				monthly = data.monthly
			} catch {
				// do nothing
			}
		}
	})

	$effect(() => {
		localStorage.setItem('donation-info', JSON.stringify({ monthly, amount }))
	})

	$effect(() => {
		if (amount && amount < 5) {
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

	function formatEuro(amount: number | null) {
		return new Intl.NumberFormat(undefined, {
			style: 'currency',
			currencyDisplay: 'name',
			trailingZeroDisplay: 'stripIfInteger',
			currency: 'EUR',
			maximumFractionDigits: 2,
		}).format(amount ?? 0)
	}

	function roundYearly(monthlyAmount: number) {
		return monthlyAmount === 1 ? 12 : Math.round((monthlyAmount * 12) / 5) * 5
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
		<section class="accordion-content" transition:slide>
			<div class="accordion-inner centered">
				<p>Meine Spende:</p>
				<ReactiveTabBar
					tabs={['Monatlich', 'Einmalig']}
					bind:active={
						() => (monthly ? 'Monatlich' : 'Einmalig'), v => (monthly = v === 'Monatlich')
					}
				/>
				<DonationAmountInput bind:amount bind:customAmount />

				{#if amount && (!monthly || smallAmount)}
					<div class="bigger-impact" transition:slide>
						<h3>Kann ich mehr bewirken?</h3>
						{#if !monthly}
							<p>
								Wir freuen uns über jeden Betrag, aber eine regelmäßige Spende hilft uns, das Queere
								Zentrum auch langfristig zu erhalten.
							</p>
							{#if amount < 5}
								<a class="button checkout-button primary" href="/spende">
									Jährlich <b>{formatEuro(roundYearly(amount))}</b> spenden
								</a>
							{:else}
								<a class="button checkout-button primary" href="/spende">
									Monatlich <b>{formatEuro(amount)}</b> spenden
								</a>
							{/if}
						{:else}
							<p>
								Jede Zahlung kostet uns eine Gebühr. Damit bei uns möglichst viel von deiner Spende
								ankommt, empfehlen wir eine <em>jährliche Spende</em>.
							</p>
							<a class="button checkout-button primary" href="/spende">
								Jährlich <b>{formatEuro(Math.max(5, roundYearly(amount)))}</b> spenden
							</a>
						{/if}
					</div>
				{/if}

				<p>
					<a
						class="button checkout-button"
						class:primary={!amount || (monthly && !smallAmount)}
						class:hidden={!amount}
						href="/spende"
					>
						{monthly ? 'Monatlich' : 'Einmalig'} <b>{formatEuro(amount)}</b> spenden
					</a>
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
			</div>
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
		<section class="accordion-content" transition:slide>
			<div class="accordion-inner centered">
				<p>
					<a class="button checkout-button primary" href={donationsInfo.paypalUrl} target="_blank">
						Mit PayPal spenden
					</a>
				</p>

				<p class="thanks">
					<img src={heartIcon} alt="" width="16px" height="16px" />
					danke, dass du uns unterstützt!
				</p>
			</div>
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
			<div class="accordion-inner">
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
			</div>
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

	p,
	.checkout-button {
		font-size: 1.166666667rem;
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

		.accordion-inner {
			display: flex;
			flex-direction: column;

			&.centered {
				text-align: center;
				max-width: 420px;
				margin: 0 auto;
			}

			&:first-child {
				border-radius: 1rem 1rem 0 0;
			}

			&:last-child {
				border-radius: 0 0 1rem 1rem;
			}

			> :last-child {
				margin-bottom: 0;
			}

			> :global(*) {
				margin-block: 0 1rem;
			}
		}

		@media (max-width: 540px) {
			padding: 1.2rem;

			p {
				line-height: 1.6rem;
			}

			p,
			.checkout-button {
				font-size: 1.08rem;
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

	.bigger-impact {
		h3 {
			margin: 0.5em 0 0 0;
			font-size: 1.3rem;
			line-height: 1.5rem;
		}

		p {
			font-size: 1rem;
			line-height: 1.5rem;
		}
	}

	.checkout-button {
		display: block;
		line-height: 1.8;
		border-radius: 15px;

		&.primary {
			text-shadow:
				1px 1px 3px vars.$COLOR_T4,
				-1px -1px 3px vars.$COLOR_T4;

			@include glitter($base-brightness: 0.2, $maximum-brightness: 0.8);
		}

		&:not(.primary) {
			color: vars.$COLOR_T4;
			background-color: white;
			box-shadow: inset 0 0 0 1.5px color.adjust(vars.$COLOR_T4, $lightness: 10%);

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
			}
		}

		&.hidden {
			visibility: hidden;
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
		p.security,
		p.thanks {
			font-size: 0.9rem;
		}
	}
</style>
