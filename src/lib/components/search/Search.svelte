<script lang="ts">
	import { m } from '$lib/paraglide/messages'
	import { localizeHref } from '$lib/paraglide/runtime'
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
	let debouncedQuery = $state('')

	let abortController: AbortController | undefined = undefined
	let searchResults = $state<SearchResponse>()

	$effect(() => {
		searchBox?.focus()
	})

	$effect(() => {
		const prevValue = searchQuery

		const handler = setTimeout(() => {
			if (searchQuery === prevValue) {
				debouncedQuery = searchQuery.trim()
			}
		}, 500)

		return () => clearTimeout(handler)
	})

	$effect(() => {
		if (debouncedQuery.length > 1) search(debouncedQuery)
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
			placeholder={m.header_search_placeholder()}
		/>

		{#if error}
			{m.header_search_error()}
		{/if}

		{#if searchResults}
			{m.header_search_results_count({ count: searchResults.nbHits ?? 0 })}
		{/if}

		<div class="results">
			{#each searchResults?.hits ?? [] as hit}
				<a class="result" href={localizeHref(hit.objectID)} onclick={() => onselect()}>
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
							{m.header_search_authors()}: {@html (
								hit._highlightResult!.authors as HighlightResultOption
							).value}
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

		<div class="provider-logo">
			powered by
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24">
				<path
					fill="currentColor"
					d="M63.998-.042C29.024-.042.511 28.16.006 63.015c-.512 35.402 28.208 64.734 63.613 64.94 10.934.063 21.465-2.612 30.817-7.693a1.5 1.5 0 0 0 .276-2.438l-5.987-5.309c-1.216-1.08-2.95-1.385-4.447-.747-6.528 2.777-13.622 4.195-20.93 4.106-28.608-.351-51.722-24.153-51.266-52.761.45-28.244 23.567-51.084 51.916-51.084h51.924v92.295l-29.46-26.176c-.952-.848-2.414-.681-3.182.335-4.728 6.262-12.431 10.155-20.987 9.564-11.868-.82-21.483-10.373-22.374-22.236-1.062-14.152 10.15-26.004 24.082-26.004 12.598 0 22.973 9.697 24.056 22.018a4.297 4.297 0 0 0 1.416 2.85l7.672 6.801c.87.77 2.253.3 2.465-.845.553-2.957.748-6.041.53-9.203-1.237-18.02-15.831-32.514-33.858-33.625-20.667-1.275-37.946 14.894-38.494 35.161-.535 19.75 15.647 36.776 35.399 37.212a36.028 36.028 0 0 0 22.067-6.904l38.492 34.122c1.651 1.462 4.255.292 4.255-1.915V2.39a2.434 2.434 0 0 0-2.432-2.43z"
				/>
			</svg>
			algolia
		</div>
	</div>
</div>

<style lang="scss">
	@use '../../../routes/vars';

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

	.provider-logo {
		margin: 3rem 0 1rem;
		color: #003dff;
		text-align: center;

		svg {
			vertical-align: middle;
		}
	}
</style>
