<script lang="ts">
	interface Props {
		label?: string
		page: number
		maxPage: number
		createUrl: (pageNumber: number) => string
	}

	let { label, page, maxPage, createUrl }: Props = $props()

	let omitFirst = $derived(page <= 4)
	let omitLast = $derived(page > maxPage - 4)
	let first = $derived(omitFirst ? 1 : page - 2)
	let last = $derived(omitLast ? maxPage : page + 2)
	let pages = $derived(Array.from({ length: last - first + 1 }).fill(0))
</script>

{#if maxPage === 1}
	<p class="pagination">
		{label ?? ''}
	</p>
{:else}
	<p class="pagination">
		{#if label}
			{label} &bull;
		{/if}
		Seite
		{#if !omitFirst}
			<span>
				<a href={createUrl(1)}>1</a>
			</span>
			...
		{/if}
		<span>
			{#each pages as _, i (i)}
				<a
					href={createUrl(i + first)}
					class:active={i + first === page}
					aria-disabled={i + first === page}
				>
					{i + first}
				</a>
			{/each}
		</span>
		{#if !omitLast}
			...
			<span>
				<a href={createUrl(maxPage)}>{maxPage}</a>
			</span>
		{/if}
	</p>
{/if}

<style lang="scss">
	.pagination {
		margin-top: 0;
		display: flex;
		align-items: center;
		gap: 7px;

		span {
			display: flex;
		}
	}

	a {
		background-color: #eee;
		border: 2px solid #aaa;
		border-radius: 0;
		padding: 0.2rem 0.7rem;
		color: black;
		font: inherit;
		font-size: 94%;
		text-decoration: none;
		transition: background-color 0.2s;
		cursor: pointer;
		margin-left: -2px;

		&:hover,
		&:focus {
			background-color: white;
		}

		&.active {
			background-color: white;
			font-weight: 600;
			cursor: normal;
		}

		&:first-of-type {
			border-top-left-radius: 15px;
			border-bottom-left-radius: 15px;
		}
		&:last-of-type {
			border-top-right-radius: 15px;
			border-bottom-right-radius: 15px;
		}
	}
</style>
