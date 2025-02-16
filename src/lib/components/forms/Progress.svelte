<script lang="ts">
	interface Props {
		min: number
		max: number
		value: number
		elem?: HTMLElement
	}

	let { min, max, value, elem = $bindable() }: Props = $props()
	let range = $derived(max - min)
	let items = $derived(Array.from({ length: range + 1 }).fill(0))
</script>

<div class="progress" bind:this={elem}>
	{#each items as _, index}
		<div class="progress-part">
			<div class="progress-track" style="width: {value - min >= index ? 100 : 0}%"></div>
		</div>
	{/each}
</div>

<style lang="scss">
	.progress {
		display: flex;
		gap: 0.5rem;
		height: 14px;
		margin: 0 0 0.75rem 0;
		scroll-margin-top: 3rem;

		.progress-part {
			height: 14px;
			flex-grow: 1;
			background-color: #0002;
			border-radius: 14px;
			position: relative;
		}

		.progress-track {
			position: absolute;
			height: 14px;
			top: 0;
			left: 0;
			background-color: var(--color-theme);
			border-radius: 14px;
			transition: width 0.3s;
		}
	}
</style>
