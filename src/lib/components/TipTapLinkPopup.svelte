<script lang="ts">
	import { parseUrl } from './parseUrl'

	export interface EditingLink {
		text: string
		url: string
		isCreating: boolean
	}

	interface Props {
		editingLink?: EditingLink
		onClose: () => void
		onUpdate: (editingLink?: EditingLink) => void
	}

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
	@use '../../routes/vars.scss' as vars;

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
		width: calc(400px + 2vw);
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
