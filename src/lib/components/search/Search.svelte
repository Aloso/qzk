<script lang="ts">
	import type { HighlightResultOption, SearchResponse, SnippetResultOption } from 'algoliasearch'

	interface Props {
		onclose: () => void
		onselect: () => void
	}

	let { onclose, onselect }: Props = $props()

	let error = $state(false)
	let overlay = $state<HTMLDivElement>()
	let searchBox = $state<HTMLInputElement>()

	let searchQuery = $state('')
	let trimmedQuery = $derived(searchQuery.trim())

	let abortController: AbortController | undefined = undefined
	let searchResults = $state<SearchResponse>()

	$effect(() => {
		searchBox?.focus()
	})

	$effect(() => {
		if (trimmedQuery.length > 1) search(trimmedQuery)
		else searchResults = undefined
	})

	async function search(query: string) {
		if (abortController) abortController.abort()

		const url = new URL('/api/search', window.location.href)
		url.searchParams.set('q', query)
		try {
			abortController = new AbortController()

			const response = await fetch(url, { method: 'GET', signal: abortController.signal })
			searchResults = (await response.json()).results[0]
		} catch {
			error = true
		}

		abortController = undefined
	}
</script>

<div
	class="search-overlay"
	role="button"
	tabindex="0"
	bind:this={overlay}
	onclick={e => {
		if (e.target === overlay) onclose()
	}}
	onkeydown={e => {
		if (e.key === 'Escape') onclose()
	}}
>
	<div class="search-popup">
		<input
			type="search"
			bind:this={searchBox}
			bind:value={searchQuery}
			placeholder="Website durchsuchen..."
		/>

		{#if searchResults}
			{searchResults.nbHits === 1
				? '1 Ergebnis'
				: searchResults.nbHits === 0
					? 'Keine Ergebnisse'
					: searchResults.nbHits + ' Ergebnisse'}
		{/if}

		<div class="results">
			{#each searchResults?.hits ?? [] as hit}
				<a class="result" href={hit.objectID} onclick={() => onselect()}>
					<span class="title">
						{#if hit.objectID.startsWith('/person/')}
							Person:
						{:else if hit.objectID.startsWith('/blog/')}
							Blog:
						{/if}
						{@html (hit._highlightResult!.title as HighlightResultOption).value}
					</span>
					{#if hit._highlightResult?.authors && (hit._highlightResult.authors as HighlightResultOption).matchLevel !== 'none'}
						<span class="line">
							Autor*innen: {@html (hit._highlightResult!.authors as HighlightResultOption).value}
						</span>
					{/if}
					{#if hit._snippetResult?.description && (hit._snippetResult.description as SnippetResultOption).matchLevel !== 'none'}
						<span class="line">
							{@html (hit._snippetResult!.description as SnippetResultOption).value}
						</span>
					{/if}
					{#if hit._snippetResult?.textContent && (hit._snippetResult.textContent as SnippetResultOption).matchLevel !== 'none'}
						<span class="line">
							{@html (hit._snippetResult!.textContent as SnippetResultOption).value}
						</span>
					{/if}
				</a>
			{/each}
		</div>

		{#if searchResults?.nbHits && searchResults.nbHits > searchResults.hits.length}
			Es werden die ersten {searchResults.hits.length} Ergebnisse angezeigt.
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	.search-overlay {
		box-sizing: border-box;
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #0004;
		animation: 0.3s fade-in;
		backdrop-filter: blur(6px);
		z-index: 1000;
		overflow: auto;
		padding: 6rem 0;
	}

	.search-popup {
		margin: 0 auto auto auto;
		display: block;
		box-sizing: border-box;
		background-color: white;
		border-radius: 30px;
		padding: min(3rem, 1.5rem + 1.3vw);
		width: calc(700px + 2vw);
		max-width: calc(100vw - 2.4rem);
	}

	input {
		display: block;
		width: 100%;
		font: inherit;
		font-size: 1.5rem;
		padding: 0.3rem 0;
		margin: 0 0 1rem 0;
		border: none;
		border-bottom: 2px solid #0002;
		transition: border-bottom-color 0.2s;

		&:hover,
		&:focus {
			border-bottom-color: var(--color-accent);
			outline: none;
		}
	}

	.result {
		display: block;
		margin: 1.5rem 0;
		color: inherit;
		text-decoration: none;

		.title {
			display: block;
			font-weight: normal;
			font-size: 1.2rem;
			margin: 0.5rem 0;
			color: var(--color-link);
			cursor: pointer;

			:global(b) {
				font-weight: 600;
			}
		}

		&:hover .title,
		&:focus .title {
			text-decoration: underline 2px var(--color-accent);
			text-underline-offset: 0.25rem;
		}

		.line {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.9rem;
			line-height: 1.25rem;
		}

		:global(em) {
			background-color: transparent;
			font-weight: 600;
			font-style: normal;
		}
	}
</style>
