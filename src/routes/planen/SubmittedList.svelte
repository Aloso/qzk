<script lang="ts">
	import type { SubmittedDraft } from '$lib/hooks/createSubmittedDrafts.svelte'

	interface Props {
		selectedKey?: string
		onSelect?: (key: string) => void
		items: SubmittedDraft[]
	}

	let { selectedKey, onSelect, items }: Props = $props()

	let titleElem = $state<HTMLElement>()
</script>

{#if items.length}
	<h2 bind:this={titleElem}>Eingereichte Veranstaltungen</h2>

	<ul class="drafts-list">
		{#each items as { key, name }}
			<li class:active={key === selectedKey}>
				<a
					href="/planen/eingereicht?key={encodeURIComponent(key)}"
					onclick={() => {
						onSelect?.(key)
						setTimeout(() => {
							if (titleElem) {
								window.scrollTo({
									left: 0,
									top: titleElem.offsetTop - 50,
									behavior: 'smooth',
								})
							}
						}, 20)
					}}
				>
					{name}
				</a>
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	.drafts-list {
		margin: 0 0 2rem 0;
		padding: 0;
	}

	li {
		display: inline-block;
		list-style: none;
		padding: 0;
		margin: 0 0.5rem 0 0;

		a {
			display: block;
			padding: 0.5rem 0.7rem;
			text-decoration: none;
			color: inherit;
			border: 2px solid #0003;
			border-radius: 15px;
			transition: 0.2s;

			&:hover,
			&:focus {
				border-color: var(--color-theme);
			}
		}
	}

	.active a {
		text-decoration: none;
		background-color: var(--color-theme);
		color: white;
	}
</style>
