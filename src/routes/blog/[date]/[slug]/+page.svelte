<script lang="ts">
	import PublishDate from '../../PublishDate.svelte'
	import Authors from '../../Authors.svelte'
	import Image from '$lib/components/Image.svelte'
	import type { BlogPost, ItemData } from '$lib/data'
	import RichText from '$lib/components/RichText.svelte'

	let { data } = $props<ItemData<BlogPost>>()
	let blogPost = data.fields
</script>

<svelte:head>
	<title>{blogPost.title} - Queeres Zentrum Kassel</title>
</svelte:head>

<div class="layout">
	<div class="mainbar">
		<h1>{blogPost.title}</h1>
		<div><PublishDate date={blogPost.published} withDescription /></div>
		<Authors authors={blogPost.authors} />
		<Image class="BlogPost-photo" img={blogPost.photo} width={800} />
		<section>
			<RichText data={blogPost.content} width={800} />
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

		@media (max-width: 900px) {
			width: auto;
		}
	}

	.sidebar {
		width: 24rem;
		margin: 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 900px) {
			width: auto;
		}
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
