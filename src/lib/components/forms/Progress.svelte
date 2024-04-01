<script lang="ts">
	interface Props {
		min: number
		max: number
		value: number
		elem?: HTMLElement
	}

	let { min, max, value, elem = $bindable() }: Props = $props()
	let range = $derived(max - min)
</script>

<div class="progress" bind:this={elem}>
	<div class="progress-bg" />
	<div class="progress-track" style="width: {((value - min) * 100) / range}%" />
</div>

<style lang="scss">
	.progress {
		box-sizing: border-box;
		display: block;
		height: 14px;
		margin: 0 0 0.75rem 0;
		padding: 2px;
		position: relative;
		scroll-margin-top: 3rem;

		.progress-bg {
			height: 10px;
			background-color: #0002;
			border-radius: 14px;
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
