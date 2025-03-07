<script lang="ts">
	import { page } from '$app/stores'
	import type { StaticPageTransformed } from '$lib/data'
	import { error } from '@sveltejs/kit'

	import ContactForm from './ContactForm.svelte'
	import IgFeed from './IgFeed.svelte'
	import NewsletterSignup from './NewsletterSignup.svelte'
	import YouTubeVideo from './YouTubeVideo.svelte'

	let { data }: { data: StaticPageTransformed } = $props()

	let omitFirst = $derived(data.headings[0]?.level === 1 && data.headings[0].text === data.name)
	let tocItems = $derived(omitFirst ? data.headings.slice(1) : data.headings)
	let hasToc = $derived(tocItems.length > 3)
	let tocHasH1 = $derived(tocItems.some(it => it.level === 1))

	let expanded = $state(false)

	// TODO: This is duplicated in FormattedContent.svelte
</script>

{#if omitFirst}
	<h1 class="top-level-h1">{data.name}</h1>
{/if}

{#if hasToc}
	<button class="toc-button" onclick={() => (expanded = !expanded)}>
		<svg class="toc-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-width="4"
				d="M3,3L11,3 M3,12L21,12 M3,21L18,21"
			/>
		</svg>
		Inhaltsverzeichnis{expanded ? ' schließen' : ''}
	</button>
{/if}

<div class="layout" class:hasToc>
	{#if hasToc}
		<div class="toc" class:mobile-hidden={!expanded}>
			<h2>Inhalt</h2>
			<ul>
				{#each tocItems as { level, text, id }}
					<li class="toc-item" style="--level: {tocHasH1 ? level - 1 : level - 2}">
						<a href="#{id}">{text}</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<section class="main-section">
		{#each data.content as part, i}
			{#if typeof part === 'string'}
				<section class:omitFirst={omitFirst && i === 0}>
					{@html part}
				</section>
			{:else if part.type === 'contact-form'}
				<ContactForm
					nextLink="https://{$page.url
						.host}/email/gesendet?context=CONTACT_FORM&backLink={encodeURIComponent(
						$page.url.href,
					)}"
				/>
			{:else if part.type === 'instagram-profile'}
				<IgFeed />
			{:else if part.type === 'newsletter-signup'}
				<NewsletterSignup />
			{:else if part.type === 'youtube'}
				{#if typeof part.param === 'string'}
					<YouTubeVideo videoId={part.param} />
				{:else}
					{error(500, { message: 'YouTube video has no video ID' })}
				{/if}
			{/if}
		{/each}
	</section>
</div>

<style lang="scss">
	@use '../../routes/vars.scss' as vars;

	@media (max-width: 78rem) {
		.mobile-hidden {
			display: none;
		}
	}

	.top-level-h1 {
		margin-bottom: 1rem;
	}

	.layout {
		display: flex;
		gap: 1rem 4rem;

		&.hasToc {
			flex-direction: row-reverse;
		}
	}

	.main-section {
		max-width: calc(100vw - 2rem);
	}

	section {
		flex-grow: 2;
		max-width: 44rem;

		&.omitFirst > :global(h1:first-child) {
			display: none;
		}
	}

	.toc-button {
		display: none;
		gap: 0.5rem;
		font-family: inherit;
		font-size: 1.1rem;
		font-weight: 500;
		padding: 0.5rem 0.6rem;
		margin: 0;
		color: #333;
		background-color: #eee;
		border-radius: 10px;
		border: none;
		align-self: start;
		align-items: center;
		text-align: left;

		.toc-icon {
			width: 0.75rem;
			height: 0.75rem;
			flex-shrink: 0;
		}

		&:hover,
		&:focus {
			background-color: #ddd;
		}

		@media (max-width: 78rem) {
			display: flex;
		}
	}

	.toc {
		flex-grow: 1;
		width: 21rem;
		max-width: 44rem;
		margin-top: 1.2rem;
		position: sticky;
		top: 5rem;
		align-self: start;

		h2 {
			font-family: inherit;
			font-size: 1.5rem;
			margin: 0 0 1rem 0;
		}

		ul {
			margin: 0;
			padding: 0;
			list-style: none;
			font-size: 1.05rem;
		}

		.toc-item {
			margin: 0.6rem 0;
			line-height: 1.3rem;
			padding-left: calc(22px * var(--level, 0));

			&:last-child {
				margin-bottom: 0;
			}

			a {
				text-decoration: none;

				&:hover,
				&:focus {
					text-decoration: underline 2px;
					text-decoration-color: var(--color-accent);
				}
			}
		}
	}

	@media (max-width: 78rem) {
		.layout.hasToc {
			flex-direction: column;
			align-items: start;
		}

		.toc {
			position: static;
			background-color: #eee;
			border: 2px solid #ddd;
			border-radius: 20px;
			padding: 1rem 1.2rem;
			width: auto;

			h2 {
				font-size: 1.3rem;
			}
		}
	}
</style>
