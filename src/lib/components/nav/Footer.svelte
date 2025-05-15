<script lang="ts">
	import type { Navigations } from '$lib/data'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'

	interface Props {
		links: Navigations['footer']
	}

	let { links }: Props = $props()

	let credentials = createAdminCredentials()
</script>

<footer>
	<div class="footer-inner">
		{#each links as section}
			<div class="link-section">
				{#if section.href}
					<a class="title" href={section.href}>{section.text}</a>
				{:else}
					<div class="title">{section.text}</div>
				{/if}
				{#each section.children ?? [] as link}
					<a href={link.href}>{link.text}</a>
				{/each}
			</div>
		{/each}
		{#if credentials.auth}
			<div class="link-section">
				<div class="title">Admin</div>
				<a href="/admin/events">Event-Verwaltung</a>
				<button
					class="a"
					onclick={() => {
						credentials.reset()
					}}
				>
					Logout ({credentials.auth.username})
				</button>
			</div>
		{/if}
	</div>
	<div class="hidden">
		<a href="/wegbeschreibung">Wegbeschreibung</a>
	</div>
</footer>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;

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

	a,
	.a {
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
