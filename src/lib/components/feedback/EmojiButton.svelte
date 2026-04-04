<script lang="ts">
	interface Props {
		value: number
		emotion?: number
		emoji: string
	}

	let { value, emotion = $bindable(), emoji }: Props = $props()
</script>

<button
	class="emoji"
	aria-checked={emotion === value}
	onclick={() => (emotion = value)}
	role="radio"
>
	{emoji}
</button>

<style lang="scss">
	.emoji {
		font-size: 1.6rem;
		border: 2px solid transparent;
		background-color: transparent;
		border-radius: 10px;
		padding: 5px;

		&:hover,
		&:focus {
			border-color: #ee6cff;
		}

		&[aria-checked='true'] {
			border-color: #d259e2;
			background-color: #f9cbff;
		}

		@media (min-width: 450px) {
			font-size: 2rem;
		}
	}
</style>
