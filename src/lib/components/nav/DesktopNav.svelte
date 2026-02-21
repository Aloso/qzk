<script lang="ts">
	import type { Navigations } from '$lib/data'
	import { m } from '$lib/paraglide/messages'
	import { deLocalizeHref, getLocale, localizeHref, setLocale } from '$lib/paraglide/runtime'
	import { isNavItem } from './navUtil'

	interface Props {
		url: string
		links: Navigations['header']
	}

	let { url, links }: Props = $props()
	let locale = getLocale()

	const locales = [
		{ locale: 'de', label: 'Deutsch' },
		{ locale: 'en', label: 'English' },
	] as const
</script>

<nav>
	{#each links as link (link)}
		{#if link.children?.length}
			<div class="nav-group">
				<a
					href={localizeHref(link.href ?? '/')}
					class="a"
					class:active={isNavItem(link, deLocalizeHref(url))}
				>
					<span class="nav-link-inner">{link[locale]}</span>
				</a>

				<div class="nav-dropdown">
					{#each link.children as child (child)}
						<a href={localizeHref(child.href ?? '/')}>
							{child[locale]}
						</a>
					{/each}
				</div>
			</div>
		{:else}
			<a
				href={localizeHref(link.href ?? '/')}
				class="a"
				class:active={isNavItem(link, deLocalizeHref(url))}
			>
				<span class="nav-link-inner">{link[locale]}</span>
			</a>
		{/if}
	{/each}

	<!--
	<div class="nav-group">
		<span class="nav-link-inner a">
			<img src="/globe.svg" alt=" " />
			{locale === 'en' ? 'EN' : 'DE'}
		</span>

		<div class="nav-dropdown">
			{#each locales as { label, locale } (locale)}
				<a
					href={localizeHref(page.url.href, { locale })}
					onclick={() => {
						localStorage.locale = locale
						setLocale(locale)
					}}
					class:active={locale === getLocale()}
				>
					{label}
				</a>
			{/each}
		</div>
	</div>
	-->

	<button class="a" data-search-button>
		<span class="nav-link-inner">
			<img src="/search.svg" alt=" " />
			{m.header_search()}
		</span>
	</button>
</nav>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars';

	nav {
		display: flex;
		flex-grow: 1;
		align-items: end;
		justify-content: center;
		margin: 0.5rem 0;
	}

	.nav-group {
		position: relative;

		&:hover .nav-dropdown,
		&:focus-within .nav-dropdown {
			display: block;
		}

		&::after {
			content: '';
			position: absolute;
			display: block;
			width: 100%;
			height: 0.5rem;
			left: 0;
			background-color: transparent;
		}
	}

	.nav-dropdown {
		display: none;
		position: absolute;
		text-align: left;
		background-color: vars.$COLOR_T0;
		padding: 0 0 0.67rem 0;
		border-radius: 0 0 15px 15px;
		border: 2px solid vars.$COLOR_T2;
		border-top: 0;
		margin-top: 0.5rem;
		margin-left: calc(-0.2rem - 2px);
		max-width: 450px;
		max-height: calc(100vh - 300px);
		overflow: auto;
		font-size: 1.05rem;
		font-weight: 500;

		a {
			display: block;
			padding: 0.15rem 1rem;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			text-decoration: none;
			color: vars.$COLOR_T4;

			/*
			&.active {
				background-color: color.adjust(vars.$COLOR_T1, $lightness: -3%);
				cursor: default;

				&:hover,
				&:focus {
					background-color: color.adjust(vars.$COLOR_T1, $lightness: -3%);
				}
			}
			*/

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T1;
				border: none;
			}
		}
	}

	.a {
		background-color: transparent;
		border: none;
		font: inherit;
		color: vars.$COLOR_T4;

		display: flex;
		position: relative;
		flex-direction: column;
		padding: 8px 0.8rem;
		margin: 0 2px;
		text-decoration: none;
		transition: 0.2s;
		font-weight: 500;
		justify-content: start;
		line-height: 1.25;
		border-radius: 15px;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T1;
		}

		&.active {
			background-color: white;
			color: vars.$COLOR_T4;
			font-weight: 600;
		}
	}

	.nav-link-inner {
		display: block;

		/*
		&.a {
			cursor: default;
		}
		*/

		img {
			width: 1em;
			height: 1em;
			margin: -2px 0.33rem -2px 0;
		}
	}

	@media (max-width: vars.$DESKTOP_BP) {
		nav {
			display: none;
		}
	}
</style>
