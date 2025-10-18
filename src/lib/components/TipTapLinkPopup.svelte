<script lang="ts">
	import { parseUrl } from './parseUrl'

	export interface EditingLink {
		text: string
		url: string
		isCreating: boolean
	}

	interface Param {
		key: string
		value: string
		enabled: boolean
	}

	interface Props {
		editingLink?: EditingLink
		onClose: () => void
		onUpdate: (editingLink?: EditingLink) => void
	}

	const commonQueryParams = new Set(['q', 'p', 'query', 'page', 'sort', 'order', 'lang'])

	let { editingLink, onClose, onUpdate }: Props = $props()

	let overlay = $state<HTMLElement>()
	let urlInput = $state<HTMLInputElement>()

	let error = $state<string>()
	let info = $derived.by(() => {
		if (editingLink && urlInput) {
			urlInput.focus()

			if (!editingLink.isCreating) {
				try {
					const protocol = new URL(editingLink.url).protocol.replace(':', '')
					return {
						https: undefined,
						http: 'Dies ist ein unsicherer Website-Link!',
						mailto: 'E-Mail-Links beginnen mit "mailto".',
						tel: 'Telefonnummer-Links beginnen mit "tel".',
					}[protocol]
				} catch {
					// do nothing
				}
			}
		}
	})
	let params = $state<Param[]>()
	let [cleanedUrl, cleanedCount] = $derived.by(() => {
		if (editingLink && params) {
			try {
				const url = new URL(editingLink.url)
				let count = 0
				for (const param of params) {
					if (!param.enabled) {
						url.searchParams.delete(param.key, param.value)
						count += 1
					}
				}
				return [url, count]
			} catch {
				// do nothing
			}
		}
		return [undefined, 0]
	})
	let isEditingParams = $state(false)
	let isTested = $state(false)

	$effect(() => {
		if (editingLink && urlInput) {
			urlInput.focus()
		}
	})

	$effect(() => {
		if (editingLink?.url) {
			error = ''
		}
	})

	$effect(() => {
		if (editingLink) {
			try {
				params = [
					...new URL(editingLink.url).searchParams
						.entries()
						.filter(([key]) => !commonQueryParams.has(key))
						.map(([key, value]): Param => ({ key, value, enabled: false })),
				]
				isTested = false
			} catch {
				params = undefined
			}
		}
	})

	function onSubmit(event: SubmitEvent) {
		event.preventDefault()

		if (!editingLink) throw new Error('editingLink is undefined')

		try {
			const { href: url, protocol } = parseUrl(editingLink.url)
			if (!['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
				error = 'Unbekanntes Protokoll: ' + protocol
				return
			}
			onUpdate({ ...editingLink, url })
			onClose()
		} catch {
			error = 'Die URL ist ungültig!'
		}
	}

	function cleanUrl() {
		if (!editingLink || !cleanedUrl) throw new Error('editingLink or cleanedUrl is undefined')

		onUpdate({ ...editingLink, url: cleanedUrl.href })
	}

	function removeLink() {
		onUpdate()
		onClose()
	}
</script>

{#if editingLink}
	<div
		class="overlay"
		role="button"
		tabindex="0"
		bind:this={overlay}
		onclick={e => {
			if (e.target === overlay) onClose()
		}}
		onkeydown={e => {
			if (e.key === 'Escape') onClose()
		}}
	>
		<div class="popup">
			<h2>Link {editingLink.isCreating ? 'hinzufügen' : 'bearbeiten'}</h2>
			<form onsubmit={onSubmit}>
				{#if editingLink.text}
					<p>
						Text:<br />
						<strong>{editingLink.text}</strong>
					</p>
				{/if}
				<label class="url-label">
					<!-- This hack (using a Unicode character that looks similar to an "a" in "Mail") prevents Bitwarden from interpreting this as a login form -->
					URL oder <span aria-label="Mail">E-Mаil</span>:<br />
					<input type="text" bind:value={editingLink.url} bind:this={urlInput} />
				</label>
				{#if error}
					<p class="error">{error}</p>
				{:else if params?.length}
					{#if isEditingParams}
						<div class="params">
							Die URL hat Parameter, die möglicherweise dem Tracking dienen und nicht benötigt
							werden:

							<table>
								<tbody>
									{#each params as { key, value, enabled }, i}
										<tr>
											<th>
												<label>
													<input
														type="checkbox"
														checked={enabled}
														onchange={e => {
															params![i].enabled = (e.target as HTMLInputElement).checked
															isTested = false
														}}
													/>
													{key}
												</label>
											</th>
											<td>
												{value.slice(0, 100) || '\xA0'}
												{#if value.length > 100}
													...
													<details class="collapsed">
														<summary>vollständig anzeigen</summary>
														{value}
													</details>
												{/if}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>

							<div class="param-help">
								<details>
									<summary>Die neue URL funktioniert nicht richtig?</summary>

									<p>
										Dann verwendet die Website Parameter, die nicht entfernt werden können. Setze
										einen Haken bei diesen Parametern und probiere es nochmal.
									</p>
								</details>

								<details>
									<summary>Woran erkenne ich Tracking-Parameter?</summary>

									<p>
										Tracking-Parameter enthalten oft unsinnige Zeichenfolgen (z.B.
										31801ce293e62d13), Informationen über dich, über deinen Browser, oder andere
										Websites.
									</p>
									<p>Meistens können alle Parameter bedenkenlos entfernt werden.</p>
								</details>
							</div>

							{#if isTested}
								<button type="button" class="apply" onclick={cleanUrl}>Übernehmen</button>
							{:else}
								<a
									class="button apply"
									href={cleanedUrl!.href}
									target="_blank"
									rel="noreferrer noopener"
									onclick={() => (isTested = true)}
								>
									URL testen
								</a>
							{/if}
							<button type="button" onclick={() => (isEditingParams = false)}>Abbrechen</button>
						</div>
					{:else}
						<div class="open-params">
							<button type="button" onclick={() => (isEditingParams = true)}>
								Tracking-Parameter entfernen
							</button>
						</div>
					{/if}
				{:else if info}
					<p class="info">{info}</p>
				{/if}

				<div class="controls">
					<button type="button" onclick={onClose}>Abbrechen</button>
					<button type="submit" class="submit-button">Fertig</button>
					{#if !editingLink.isCreating}
						<button type="button" class="delete-button" onclick={removeLink}>Link entfernen</button>
					{/if}
				</div>
			</form>
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../routes/vars';

	.overlay {
		box-sizing: border-box;
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #0003;
		animation: 0.3s fade-in;
		z-index: 1001;
		overflow: auto;
		padding: 4rem 1.2rem;
		color: black;
	}

	.popup {
		margin: auto;
		display: block;
		box-sizing: border-box;
		background-color: white;
		border-radius: 30px;
		padding: min(2.5rem, 1.5rem + 1vw);
		width: calc(33rem + 2vw);
		max-width: 95vw;

		h2 {
			margin-top: 0;
		}
	}

	.url-label {
		display: block;
		margin: 1rem 0;

		input {
			box-sizing: border-box;
			border: 2px solid #aaa;
			border-radius: 8px;
			font: inherit;
			background-color: white;
			color: black;
			padding: 8px 12px;
			margin: 5px 0 0 0;
			width: 100%;
			transition: 0.2s;

			&:hover,
			&:focus {
				border-color: var(--color-theme);
				outline: none;
			}
		}
	}

	.params {
		background-color: #eee;
		border-radius: 15px;
		padding: 15px;

		.param-help {
			display: flex;
			flex-direction: column;
			margin: 1rem 0;

			p {
				font-size: inherit;
			}

			summary {
				font-style: italic;
			}
		}

		table {
			border-collapse: collapse;
			border: 2px solid #ccc;
			display: table;
			width: calc(100% + 30px);
			margin: 1rem -15px;

			tr:nth-child(odd) {
				background-color: white;
			}

			th {
				padding: 0;
				text-align: left;
				font-weight: 600;
				min-width: 30%;
				position: relative;

				label {
					display: flex;
					gap: 0.2rem;
					padding: 3px 7px 3px 15px;
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					align-items: center;
					box-sizing: border-box;
				}
			}
			td {
				padding: 3px 15px 3px 7px;
				word-break: break-all;

				.collapsed {
					font-size: 0.95rem;

					summary {
						color: gray;
						margin-top: 5px;

						&:hover {
							color: black;
						}
					}
				}
			}
		}
	}
	.params button,
	.open-params button,
	a.button {
		border: none;
		color: black;
		background-color: #0001;
		border-radius: 8px;
		font: inherit;
		padding: 7px 10px;
		text-decoration: none;

		&:hover,
		&:focus {
			background-color: #0002;
		}
	}

	.params button.apply,
	a.button.apply {
		color: white;
		background-color: var(--color-theme);

		&:hover,
		&:focus {
			opacity: 0.85;
		}
	}

	.error {
		font-size: 1rem;
		color: red;
	}
	.info {
		font-size: 0.9rem;
	}

	.controls {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: end;

		button {
			display: block;
			margin: 0;
			font: inherit;
			font-size: 1.1rem;
			padding: 12px 15px;
			border-radius: 12px;
			transition: 0.2s;
			text-decoration: none;
			border: none;

			&.submit-button {
				color: white;
				background-color: var(--color-theme);

				&:hover,
				&:focus {
					opacity: 0.85;
				}
			}

			&.delete-button {
				color: #d10000;
				border-color: #d10000;
			}
		}
	}
</style>
