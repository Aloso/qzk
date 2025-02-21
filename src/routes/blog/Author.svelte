<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import type { PersonPreview } from '$lib/data'

	interface Props {
		author: PersonPreview
	}

	let { author }: Props = $props()
</script>

<a class="author" href="/person/{author.slug}">
	<Image
		class="BlogPost-Author-photo"
		img={author.photo}
		alt="Bild des Autors {author.name}"
		width={60}
		height={60}
		context="Autor: {author.name}"
	/>
	<div class="right">
		<span class="name">
			{author.name}
		</span>
		<span class="role">{author.role}</span>
	</div>
</a>

<style lang="scss">
	.author {
		display: inline-flex;
		gap: 1rem;
		align-items: center;
		min-height: 60px;
		border-radius: 30px;
		text-decoration: none;
		transition: 0.2s;
		color: inherit;
		max-width: 90%;

		&:hover,
		&:focus {
			background-color: #eee;
		}
	}

	:global(.BlogPost-Author-photo) {
		width: 60px;
		height: 60px;
		border-radius: 50%;
	}

	.right {
		display: flex;
		flex-direction: column;
		padding: 0 1.5rem 2px 0;
	}

	.name {
		font-size: 1.2rem;
		margin-bottom: 3px;
		line-height: 27px;
	}

	.role {
		color: #555;
		font-size: 0.93rem;
	}
</style>
