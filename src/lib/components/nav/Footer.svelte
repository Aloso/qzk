<script lang="ts">
	import type { Navigations } from '$lib/data'

	interface Props {
		links: Navigations['footer']
	}

	let { links }: Props = $props()
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
				{#each section.children as link}
					<a href={link.href}>{link.text}</a>
				{/each}
			</div>
		{/each}
	</div>
</footer>

<style lang="scss">
	footer {
		border-top: 3px solid hsl(289, 55%, 89%);
		background-color: hsl(289, 65%, 94%);
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
		font-weight: 500;
		text-decoration: none;
		color: var(--color-theme);
	}

	.link-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.title {
		margin: 0.5rem 0;
		opacity: 0.8;
	}
</style>
