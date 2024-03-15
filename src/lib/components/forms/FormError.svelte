<script lang="ts">
	let { visible }: { visible: boolean } = $props()
</script>

<div class="error" aria-hidden={!visible} class:visible>
	<slot />
</div>

<style lang="scss">
	.error {
		display: none;
		font-size: 0.9rem;
		margin: 0.5rem 0 0 0;
		color: red;

		&.visible {
			display: block;
		}
	}
</style>
