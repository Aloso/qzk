<script lang="ts">
	import StarterKit from '@tiptap/starter-kit'
	import Link from '@tiptap/extension-link'
	import Subscript from '@tiptap/extension-subscript'
	import Superscript from '@tiptap/extension-superscript'
	import { Editor } from '@tiptap/core'
	import { onMount } from 'svelte'
	import type { HTMLAttributes } from 'svelte/elements'
	import type { EditingLink } from './TipTapLinkPopup.svelte'
	import TipTapLinkPopup from './TipTapLinkPopup.svelte'
	import { parseUrl } from './parseUrl'
	import { browser } from '$app/environment'

	interface Props extends HTMLAttributes<HTMLDivElement> {
		htmlValue: string
		id: string
		headingLevels: (1 | 2 | 3 | 4 | 5 | 6)[]
		showHelp: boolean
	}

	let {
		htmlValue = $bindable(),
		id,
		headingLevels,
		showHelp = $bindable(),
		...rest
	}: Props = $props()

	let element = $state<HTMLDivElement>()
	let editor = $state.raw<Editor>()
	let s = $state<ReturnType<typeof getState>>()
	let expanded = $state(false)
	let clientWidth = $state(1000)
	let relativeWidth = $derived.by(() => {
		if (browser) {
			return clientWidth / Number(getComputedStyle(document.body).fontSize.replace('px', ''))
		}
		return clientWidth / 18
	})
	let editingLink = $state<EditingLink>()

	onMount(() => {
		if (element) {
			editor = new Editor({
				element,
				extensions: [
					StarterKit.configure({
						heading: { levels: headingLevels },
						link: false,
					}),
					Subscript,
					Superscript,
					Link.configure({
						openOnClick: false,
						autolink: true,
						defaultProtocol: 'https',
						protocols: ['http', 'https', 'mailto', 'tel'],
						isAllowedUri: (url, ctx) => {
							try {
								const parsedUrl = parseUrl(url)

								if (!ctx.defaultValidate(parsedUrl.href)) {
									return false
								}

								const protocol = parsedUrl.protocol.replace(':', '')
								return ctx.protocols.some(
									p => p === protocol || (typeof p === 'object' && p.scheme === protocol),
								)
							} catch {
								return false
							}
						},
						shouldAutoLink: url => {
							try {
								const parsedUrl = parseUrl(url)

								// only auto-link if the domain is not in the disallowed list
								const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
								const domain = parsedUrl.hostname

								return !disallowedDomains.includes(domain)
							} catch {
								return false
							}
						},
					}),
				],
				content: htmlValue,
				onTransaction: () => {
					s = getState(editor!)
					htmlValue = editor!.getHTML()
				},
			})
			s = getState(editor)
			element.children[0].id = id
		}
	})

	function getState(editor: Editor) {
		return {
			bold: editor.isActive('bold'),
			italic: editor.isActive('italic'),
			strike: editor.isActive('strike'),
			paragraph: editor.isActive('paragraph'),
			bulletList: editor.isActive('bulletList'),
			orderedList: editor.isActive('orderedList'),
			blockquote: editor.isActive('blockquote'),
			link: editor.isActive('link'),

			canBold: editor.can().chain().focus().toggleBold().run(),
			canItalic: editor.can().chain().focus().toggleItalic().run(),
			canStrike: editor.can().chain().focus().toggleStrike().run(),
			canBlockQuote: editor.can().chain().focus().toggleBlockquote().run(),

			canUndo: editor.can().chain().focus().undo().run(),
			canRedo: editor.can().chain().focus().redo().run(),

			headingLevel: editor.getAttributes('heading')?.level,
		}
	}

	const toggleBold = () => editor!.chain().focus().toggleBold().run()
	const toggleItalic = () => editor!.chain().focus().toggleItalic().run()
	const toggleStrike = () => editor!.chain().focus().toggleStrike().run()

	const toggleBlockquote = () => editor!.chain().focus().toggleBlockquote().run()
	const toggleBulletList = () => editor!.chain().focus().toggleBulletList().run()
	const toggleOrderedList = () => editor!.chain().focus().toggleOrderedList().run()

	const setParagraph = () => editor!.chain().focus().setParagraph().run()
	const setHorizontalRule = () => editor!.chain().focus().setHorizontalRule().run()
	const setHardBreak = () => editor!.chain().focus().setHardBreak().run()

	const undo = () => editor!.chain().focus().undo().run()
	const redo = () => editor!.chain().focus().redo().run()

	function clickLink() {
		const previousUrl = editor!.getAttributes('link')?.href
		if (previousUrl) {
			editor!.chain().focus().extendMarkRange('link').run()
		}
		const { from, to } = editor!.state.selection
		const text = editor!.state.doc.textBetween(from, to)
		editingLink = { text, url: previousUrl ?? '', isCreating: previousUrl === undefined }
	}
</script>

{#if editor}
	<div
		class="control-group"
		class:expanded
		class:md={relativeWidth < 32}
		class:sm={relativeWidth < 28}
		class:xs={relativeWidth < 22}
		class:show-help={showHelp}
		bind:clientWidth
	>
		<div class="button-group g1">
			<button
				type="button"
				onclick={toggleBold}
				disabled={!s!.canBold}
				class="text"
				class:is-active={s!.bold}
				title="Fett"
				aria-label="Fett"
			>
				<b>F</b>
			</button>
			<button
				type="button"
				onclick={toggleItalic}
				disabled={!s!.canItalic}
				class="text"
				class:is-active={s!.italic}
				title="Kursiv"
				aria-label="Kursiv"
			>
				<i>K</i>
			</button>
			<button
				type="button"
				onclick={toggleStrike}
				disabled={!s!.canStrike}
				class="text"
				class:is-active={s!.strike}
				title="Durchgestrichen"
				aria-label="Durchgestrichen"
			>
				<s>S</s>
			</button>
		</div>
		<div class="help h1">
			Mit diesen Buttons kannst du den ausgewählten Text <em>fett</em> (<b>F</b>), <em>kursiv</em>
			(<i>K</i>) bzw. <em>durchgestrichen</em> (<s>S</s>) machen.
		</div>

		<div class="button-group g2">
			<button
				type="button"
				class:is-active={s!.link}
				onclick={clickLink}
				aria-label="Link"
				title="Link"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"
					/></svg
				>
			</button>
			<button type="button" onclick={setHorizontalRule} aria-label="Trennlinie" title="Trennlinie">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"><path d="M160-440v-80h640v80H160Z" /></svg
				>
			</button>
			<button type="button" onclick={setHardBreak} title="Zeilenumbruch" aria-label="Zeilenumbruch">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M360-240 120-480l240-240 56 56-144 144h488v-160h80v240H272l144 144-56 56Z"
					/></svg
				>
			</button>
		</div>
		<div class="help h2">
			Hiermit kannst du einen <em>Link</em> einfügen oder bearbeiten, eine <em>Trennlinie</em>
			einfügen, und einen <em>Manuellen Zeilenumbruch</em> einfügen.
		</div>

		<div class="button-group g3">
			<button
				type="button"
				onclick={toggleBlockquote}
				disabled={!s!.canBlockQuote}
				class:is-active={s!.blockquote}
				title="Zitat"
				aria-label="Zitat"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="m228-240 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T458-480L320-240h-92Zm360 0 92-160q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 23-5.5 42.5T818-480L680-240h-92ZM320-500q25 0 42.5-17.5T380-560q0-25-17.5-42.5T320-620q-25 0-42.5 17.5T260-560q0 25 17.5 42.5T320-500Zm360 0q25 0 42.5-17.5T740-560q0-25-17.5-42.5T680-620q-25 0-42.5 17.5T620-560q0 25 17.5 42.5T680-500Zm0-60Zm-360 0Z"
					/></svg
				>
			</button>
			<button
				type="button"
				onclick={toggleBulletList}
				class:is-active={s!.bulletList}
				title="Liste"
				aria-label="Liste"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M360-200v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360ZM200-160q-33 0-56.5-23.5T120-240q0-33 23.5-56.5T200-320q33 0 56.5 23.5T280-240q0 33-23.5 56.5T200-160Zm0-240q-33 0-56.5-23.5T120-480q0-33 23.5-56.5T200-560q33 0 56.5 23.5T280-480q0 33-23.5 56.5T200-400Zm0-240q-33 0-56.5-23.5T120-720q0-33 23.5-56.5T200-800q33 0 56.5 23.5T280-720q0 33-23.5 56.5T200-640Z"
					/></svg
				>
			</button>
			<button
				type="button"
				onclick={toggleOrderedList}
				class:is-active={s!.orderedList}
				title="Nummerierte Liste"
				aria-label="Nummerierte Liste"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M120-80v-60h100v-30h-60v-60h60v-30H120v-60h120q17 0 28.5 11.5T280-280v40q0 17-11.5 28.5T240-200q17 0 28.5 11.5T280-160v40q0 17-11.5 28.5T240-80H120Zm0-280v-110q0-17 11.5-28.5T160-510h60v-30H120v-60h120q17 0 28.5 11.5T280-560v70q0 17-11.5 28.5T240-450h-60v30h100v60H120Zm60-280v-180h-60v-60h120v240h-60Zm180 440v-80h480v80H360Zm0-240v-80h480v80H360Zm0-240v-80h480v80H360Z"
					/></svg
				>
			</button>
		</div>
		<div class="help h3">
			Hiermit kannst du den Absatz als <em>Zitat</em>, als <em>Aufzählung</em> oder als
			<em>nummerierte Liste</em> formatieren.
		</div>

		<div class="button-group g4">
			<select
				value={s!.paragraph ? 'P' : s!.headingLevel !== undefined ? `H${s!.headingLevel}` : ''}
			>
				<option value="P" onclick={setParagraph}>Absatz</option>
				{#each headingLevels as level (level)}
					<option
						value="H{level}"
						onclick={() => editor!.chain().focus().setHeading({ level }).run()}
						>Überschrift {level}</option
					>
				{/each}
			</select>
		</div>
		<div class="help h4">
			Auswahl, ob die Auswahl ein Absatz oder eine Überschrift ist. Bei Überschriften kannst du
			auswählen, welche Ebene: "Überschrift 1" für den Titel, "Überschrift 2" für die 2. Ebene, und
			so weiter.
		</div>

		<div class="button-group g5">
			<button
				type="button"
				onclick={undo}
				disabled={!s!.canUndo}
				aria-label="Rückgängig"
				title="Rückgängig"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M280-200v-80h284q63 0 109.5-40T720-420q0-60-46.5-100T564-560H312l104 104-56 56-200-200 200-200 56 56-104 104h252q97 0 166.5 63T800-420q0 94-69.5 157T564-200H280Z"
					/></svg
				>
			</button>
			<button
				type="button"
				onclick={redo}
				disabled={!s!.canRedo}
				aria-label="Wiederholen"
				title="Wiederholen"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M396-200q-97 0-166.5-63T160-420q0-94 69.5-157T396-640h252L544-744l56-56 200 200-200 200-56-56 104-104H396q-63 0-109.5 40T240-420q0 60 46.5 100T396-280h284v80H396Z"
					/></svg
				>
			</button>
		</div>
		<div class="help h5">Rückgängig und wiederholen</div>

		<div class="button-group expander">
			<button
				type="button"
				onclick={() => (expanded = !expanded)}
				class:is-active={expanded}
				title="Mehr Aktionen"
				aria-label="Mehr Aktionen"
				style="flex-grow: 0.2"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					height="24px"
					viewBox="0 -960 960 960"
					width="24px"
					fill="currentColor"
					><path
						d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"
					/></svg
				>
			</button>
		</div>
		<div class="help expander-help">Tippe hier, um weitere Aktionen auszuklappen</div>

		<div class="expander-div"></div>

		<button type="button" class="close-help is-active" onclick={() => (showHelp = false)}>
			Hilfe schließen
		</button>
	</div>
{/if}

<div bind:this={element} {...rest}></div>

<TipTapLinkPopup
	{editingLink}
	onClose={() => (editingLink = undefined)}
	onUpdate={link => {
		if (link === undefined) {
			editor!.chain().focus().extendMarkRange('link').unsetLink().run()
		} else {
			editor!.chain().focus().extendMarkRange('link').setLink({ href: link.url }).run()
		}
		editingLink = link
	}}
/>

<style lang="scss">
	@use '../../routes/vars';

	.control-group {
		display: flex;
		flex-wrap: wrap;
		margin: 0 0 0.4rem 0;
		gap: 0.25rem 0.6rem;

		position: sticky;
		top: 73px;
		z-index: 1;
		background: var(--background, #eee);
		box-shadow:
			0 -10px 0 var(--background, #eee),
			0 1px 4px 5px var(--background, #eee);

		@media (max-width: vars.$DESKTOP_BP) {
			top: 81px;
			margin-top: 10px;
		}

		&:not(.show-help):not(.expanded) {
			&.xs .g3,
			&.sm .g4,
			&.sm .g5 {
				display: none;
			}
		}

		// NEVER show undo/redo in medium and extra-small sizes, to preserve space
		&.md:not(.sm) .g5,
		&.md:not(.sm) .h5,
		&.xs .g5,
		&.xs .h5 {
			display: none;
		}

		&.show-help .expander {
			justify-content: start;
		}
		&:not(.sm) .expander-help {
			display: none;
		}
	}

	.button-group {
		display: flex;
		justify-content: stretch;
		flex-grow: 1;
	}

	button {
		opacity: 0.85;
		background-color: transparent;
		color: black;
		border: none;
		padding: 0 4px;
		font: inherit;
		font-size: 1.2rem;
		line-height: 2rem;
		border-radius: 8px;
		transition: 0.2s;
		flex-grow: 1;
		max-width: 2.6rem;

		&.text {
			padding: 0 10px;
		}

		&:hover:not(.is-active):not(:disabled) {
			background-color: #0001;
		}

		&:disabled {
			background-color: transparent;
			color: #a1a1a1;
		}

		svg {
			display: block;
			width: 1.25rem;
			height: 1.25rem;
			margin: 0 auto;
		}
	}

	select {
		opacity: 0.85;
		border: 2px solid #0003;
		background: transparent;
		padding: 3px 10px;
		font: inherit;
		font-size: 0.95rem;
		border-radius: 8px;
		transition: 0.2s;
		flex-grow: 1;

		&:hover {
			border-color: var(--color-theme);
		}
	}

	.is-active {
		background-color: var(--color-theme);
		color: white;

		&:hover {
			opacity: 1;
		}
	}

	// connect button groups
	.is-active + .is-active {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}
	.is-active:has(+ .is-active) {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.expander {
		justify-content: end;
		display: none;

		.sm & {
			display: flex;
		}
	}

	.expander-div {
		width: 100%;
		display: none;

		.xs.expanded & {
			display: block;
		}
	}

	.g1,
	.h1 {
		order: 0;
	}
	.g2,
	.h2 {
		order: 1;
	}
	.g3,
	.h3 {
		order: 2;
	}
	.g4,
	.h4 {
		order: 3;
	}
	.g5,
	.h5 {
		order: 4;
	}
	.close-help {
		order: 5;
	}

	.g4 {
		// dropdown
		flex-grow: 2;
	}

	.sm {
		.expander,
		.expander-div {
			order: 2;
		}
	}
	.xs {
		.expander,
		.expander-div {
			order: 1;
		}
	}

	.show-help {
		.expander,
		.expander-div,
		.expander-help {
			order: 5;
		}

		.close-help {
			display: block;
		}
	}

	.close-help {
		max-width: unset;
		flex-grow: 0;
		font-size: 1.08rem;
		padding: 3px 10px;
		display: none;
	}

	.help {
		display: none;

		.show-help & {
			display: block;
			width: 100%;
			box-sizing: border-box;
			padding: 0 0 5px 20px;
			font-size: 0.93rem;
		}
	}
</style>
