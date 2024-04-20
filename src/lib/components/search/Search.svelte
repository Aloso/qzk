<script lang="ts">
	import { initSearchIndex, search } from '$lib/search'
	import type { SearchData, SearchResult, SearchResultExt } from '$lib/search'
	import { onMount } from 'svelte'

	interface Props {
		onclose: () => void
		onselect: (result: SearchResult) => void
	}

	let { onclose, onselect }: Props = $props()

	let overlay = $state<HTMLDivElement>()
	let searchBox = $state<HTMLInputElement>()

	let initialized = $state(false)
	let error = $state<false | string>(false)
	let searchTerms = $state('')

	let searchResults = $derived.by(() => {
		return search(searchTerms).map(res => ({ ...res, matches: getMatches(res, 4) }))
	})

	onMount(async () => {
		if (!initialized) {
			let data: SearchData
			try {
				data = await fetch('/search.json').then(data => data.json())
			} catch {
				error = 'Suche konnte nicht initialisiert werden!'
				return
			}
			initSearchIndex(data)
			initialized = true
		}
	})

	$effect(() => {
		searchBox?.focus()
	})

	function escapeRegExp(str: string) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}

	function escapeHtml(str: string) {
		return str.replace(/[<>&]/g, c => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'))
	}

	function optionalUmlauts(str: string) {
		return str.replace(/[aou]|ss/g, s =>
			s === 'a' ? '[aä]' : s === 'o' ? '[oö]' : s === 'u' ? '[uü]' : s === 'ss' ? '(?:ss|ß)' : s,
		)
	}

	function getMatches(res: SearchResultExt, limit = 1) {
		const indices: [string, number, number][] = []

		outerLoop: for (const [term, item] of Object.entries(res.metadata)) {
			const escaped = optionalUmlauts(escapeRegExp(term))
			const regExp = RegExp(`(?<![\\wäöüß])${escaped}[\\wäöüß]{0,4}(?![\\wäöüß])`, 'gi')

			for (const field of Object.keys(item) as ('n' | 'a' | 'c')[]) {
				const fieldContent = res[field]!
				let arr: RegExpExecArray | null
				while ((arr = regExp.exec(fieldContent)) !== null) {
					indices.push([fieldContent, arr.index, arr[0].length])

					if (indices.length === limit) break outerLoop
				}
			}
		}

		return indices.map(([text, index, len]) => {
			const start = index - 20
			const end = index + 100
			const excerpt1 = text.substring(start, index).trimStart()
			const excerpt2 = text.substring(index, index + len)
			const excerpt3 = text.substring(index + len, end).trimEnd()
			return [excerpt1, excerpt2, excerpt3, start === 0, end === text.length] as const
		})
	}

	function formatTitle(res: SearchResultExt) {
		const escapedText = escapeHtml(res.n)

		const terms = Object.entries(res.metadata)
		const mappedTerms = terms.flatMap(([term, item]) => (item.n ? escapeRegExp(term) : []))
		if (mappedTerms.length === 0) return escapedText

		const escapedTerms = optionalUmlauts(mappedTerms.join('|'))
		const regExp = RegExp(`(?<![\\wäöüß])((${escapedTerms})[\\wäöüß]{0,4})(?![\\wäöüß])`, 'gi')

		return escapedText.replace(regExp, '<b>$1</b>')
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
			type="text"
			bind:this={searchBox}
			bind:value={searchTerms}
			placeholder="Website durchsuchen..."
		/>

		{#if searchTerms.length >= 2}
			{searchResults.length === 10
				? '10+ Ergebnisse'
				: searchResults.length === 1
					? '1 Ergebnis'
					: searchResults.length === 0
						? 'Keine Ergebnisse'
						: searchResults.length + ' Ergebnisse'}
		{/if}

		<div class="results">
			{#each searchResults as result}
				<a class="result" href="/{result.slug}" onclick={() => onselect(result)}>
					<span class="title a">
						{#if result.type === 'Person'}
							Person:
						{:else if result.type === 'BlogPost'}
							Blog Post:
						{/if}
						{@html formatTitle(result)}
					</span>
					{#each result.matches as [before, match, after, isStart, isEnd]}
						<span class="line">
							{isStart ? '' : '...'}{before}<mark>{match}</mark>{after}{isEnd ? '' : '...'}
						</span>
					{/each}
				</a>
			{/each}
		</div>
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
		background-color: #0005;
		animation: 0.3s fade-in;
		z-index: 1000;
		overflow: auto;
		padding: 4rem 0;
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

		h2 {
			margin-top: 0;
		}
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
		margin: 1rem 0;
		color: inherit;
		text-decoration: none;

		.title {
			display: block;
			font-weight: normal;
			margin: 0.5rem 0;

			b {
				font-weight: 600;
			}
		}

		&:hover .title {
			text-decoration-color: var(--color-accent);
		}

		.line {
			display: block;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 0.9rem;
			line-height: 1.25rem;
		}

		mark {
			background-color: #ffff41;
		}
	}
</style>
