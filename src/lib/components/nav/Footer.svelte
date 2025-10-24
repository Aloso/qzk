<script lang="ts">
	import type { Navigations } from '$lib/data'
	import { m } from '$lib/paraglide/messages'
	import { getLocale, localizeHref } from '$lib/paraglide/runtime'
	import { onMount } from 'svelte'

	interface Props {
		links: Navigations['footer']
	}

	let { links }: Props = $props()
	let locale = getLocale()

	let loggedIn = $state(false)
	onMount(() => {
		loggedIn = !!localStorage.loggedIn
	})
</script>

<footer>
	<div class="footer-inner">
		{#each links as section (section)}
			<div class="link-section">
				{#if section.href}
					<a class="title" href={localizeHref(section.href)}>{section[locale]}</a>
				{:else}
					<div class="title">{section[locale]}</div>
				{/if}
				{#each section.children ?? [] as link (link)}
					<a href={localizeHref(link.href ?? '/')}>{link[locale]}</a>
				{/each}
			</div>
		{/each}
		{#if loggedIn}
			<div class="link-section">
				<div class="title">Admin</div>
				<a href={localizeHref('/admin/events/drafts/1')}>{m.footer_event_management()}</a>
				<a href={localizeHref('/admin/logout')}>{m.footer_logout()}</a>
			</div>
		{/if}
	</div>
	<div class="hidden">
		<a href={localizeHref('/wegbeschreibung')}>Wegbeschreibung</a>
	</div>
</footer>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars';

	footer {
		border-top: 3px solid vars.$COLOR_T2;
		background-color: vars.$COLOR_T0;
		margin-top: 4rem;
		padding-bottom: 2rem;
	}

	.footer-inner {
		display: flex;
		gap: 2.5rem 4rem;
		padding: 1rem;
		margin: 0 auto;
		max-width: 70rem;
		box-sizing: border-box;
		flex-wrap: wrap;
	}

	a {
		font-size: inherit;
		font-weight: 500;
		text-decoration: none;
		color: color.adjust(vars.$COLOR_T4, $lightness: -10%);
		align-self: start;
		font-family: inherit;
		font-size: inherit;
		padding: 0;

		&:hover {
			color: vars.$COLOR_T4;
		}

		@media (pointer: coarse) {
			padding: 0.2rem 0;
		}
	}

	.link-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 8rem;
	}

	.title {
		margin: 0.5rem 0;
		opacity: 0.8;
	}

	.hidden {
		display: none;
	}
</style>
