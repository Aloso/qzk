<script lang="ts">
	import { resolve } from '$app/paths'
	import { m } from '$lib/paraglide/messages'
	import type { FeedbackV1 } from '../../../routes/api/feedback/v1/+server'
	import EmojiButton from './EmojiButton.svelte'

	let emotion = $state<number>()
	let textResponse = $state('')
	let submitted = $state(false)

	async function submit(event: SubmitEvent) {
		event.preventDefault()
		if (emotion === undefined) return
		submitted = true

		await fetch(resolve('/api/feedback/v1', {}), {
			method: 'POST',
			body: JSON.stringify({ emotion, textResponse } as FeedbackV1),
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
		})
	}
</script>

<section class="feedback">
	<div class="section-inner">
		{#if submitted}
			<h2 class="thanks">{m.feedback_thanks()}</h2>
		{:else}
			<h2>{m.feedback_happiness()}</h2>

			<div class="emojis">
				<EmojiButton emoji="😭" bind:emotion value={-2} />
				<EmojiButton emoji="😟" bind:emotion value={-1} />
				<EmojiButton emoji="😑" bind:emotion value={0} />
				<EmojiButton emoji="😊" bind:emotion value={1} />
				<EmojiButton emoji="🤩" bind:emotion value={2} />
			</div>

			{#if emotion !== undefined}
				<form action="" onsubmit={submit}>
					<p class="question">
						{emotion >= 1 ? m.feedback_wishes() : m.feedback_improve()}
					</p>
					<p class="optional">{m.feedback_optional()}</p>
					<textarea bind:value={textResponse}></textarea>

					<button type="submit" class="submit-button">{m.feedback_submit()}</button>
				</form>
			{/if}
		{/if}
	</div>
</section>

<style lang="scss">
	.feedback {
		margin-top: 2rem;
		border: 2px solid transparent;
		border-radius: 25px;

		background-image:
			linear-gradient(150deg, white, #fbdeff), linear-gradient(150deg, #f9cbff, #ee6cff);
		background-origin: border-box;
		background-clip: content-box, border-box;
	}

	.section-inner {
		padding: 1rem;
	}

	h2 {
		margin: 0 0 0.3rem 0;
		font-size: 1.33rem;

		&.thanks {
			text-align: center;
			margin: 1rem 0;
		}
	}

	p {
		font-size: 1rem;
		margin: 0.3rem 0;
		line-height: 1.33rem;
	}

	.optional {
		font-style: italic;
		margin-top: -0.3rem;
	}

	.submit-button {
		display: block;
		margin-top: 1rem;
		color: white;
		background-color: #c737da;
		border: none;
		font: inherit;
		padding: 0.5rem 1rem;
		border-radius: 10px;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: #ae0ec3;
		}
	}

	.question {
		font-weight: 600;
		margin: 1rem 0 0.5rem;
		line-height: 1.3rem;
	}

	.emojis {
		display: flex;
		justify-content: center;
	}

	textarea {
		display: block;
		width: 100%;
		min-height: 100px;
		resize: vertical;
		margin: 0.3rem 0;
		border: 2px solid #00000042;
		border-radius: 10px;
		font: inherit;
		padding: 0.4rem 0.5rem;
		box-sizing: border-box;

		&:hover,
		&:focus {
			border-color: #ee6cff;
			outline: none;
		}
	}
</style>
