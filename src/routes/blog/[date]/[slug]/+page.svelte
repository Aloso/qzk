<script lang="ts">
	import PublishDate from '../../PublishDate.svelte'
	import Authors from '../../Authors.svelte'
	import Image from '$lib/components/Image.svelte'
	import type { BlogPost } from '$lib/data'
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

	export let data: BlogPost
</script>

<svelte:head>
	<title>{data.title} - Queeres Zentrum Kassel</title>
</svelte:head>

<div class="layout">
	<div class="mainbar">
		<h1>{data.title}</h1>
		<div><PublishDate date={data.published} withDescription /></div>
		<Authors authors={data.authors} />
		<Image class="BlogPost-photo" img={data.photo} width={800} />
		<section>
			{@html documentToHtmlString(data.content)}
		</section>
	</div>

	<div class="sidebar">
		<div class="sidebar-title">Hier entsteht eine Sidebar</div>
		<div class="box">Was soll denn hier für Inhalt rein?</div>
		<div class="box">Was soll denn hier für Inhalt rein?</div>
	</div>
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 2rem;

		@media (max-width: 900px) {
			flex-direction: column;
		}
	}

	.mainbar {
		width: 44rem;
	}

	.sidebar {
		width: 24rem;
		margin: 2rem 0;
		position: sticky;
		top: 0;
	}

	.sidebar-title {
		font-size: 1.67rem;
		font-weight: 600;
		margin-bottom: 1em;
	}

	.box {
		background-color: #ddd;
		padding: 5rem 1.4rem;
		margin: 1rem 0;
		border-radius: 30px;
		text-align: center;
	}

	:global(.BlogPost-photo) {
		border-radius: 30px;
		margin-bottom: 1rem;
		width: 100%;
		height: auto;
	}

	section {
		max-width: 44rem;
	}
</style>
