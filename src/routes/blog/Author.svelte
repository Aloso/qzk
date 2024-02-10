<script lang="ts">
	import Image from '$lib/components/Image.svelte'
	import type { AuthorPreview } from '$lib/data'

	interface Props {
		author: AuthorPreview
		small?: boolean
		single?: boolean
	}

	let { author, small, single } = $props<Props>()
</script>

<a class="author" class:small class:single href="/autor/{author.slug}">
	<Image
		class="BlogPost-Author-photo"
		img={author.photo}
		alt="Bild des Autors {author.name}"
		width={small ? 30 : 60}
		height={small ? 30 : 60}
	/>
	<div class="right" class:small>
		<span class="name" class:small>{author.name}</span>
		<span class="role" class:small>{author.role}</span>
	</div>
</a>

<style lang="scss">
	.author {
		display: inline-flex;
		gap: 1rem;
		align-items: center;
		margin: 1rem 1rem 0 0;
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

		&.small {
			min-height: 30px;
			gap: 0.75rem;
		}

		&.single {
			margin: 0;
		}
	}

	:global(.BlogPost-Author-photo) {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		.small & {
			width: 30px;
			height: 30px;
		}
	}

	.right {
		display: flex;
		flex-direction: column;
		padding: 0 1.8rem 2px 0;
		&.small {
			padding: 0 1rem 2px 0;
		}
	}

	.name {
		font-size: 1.2rem;
		margin-bottom: 3px;
		&.small {
			font-size: 1rem;
			margin-bottom: 0;
		}
	}

	.role {
		color: #555;
		&.small {
			display: none;
		}
	}
</style>
