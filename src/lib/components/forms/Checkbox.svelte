<script lang="ts">
	import type { Snippet } from 'svelte'
	import FormError from './FormError.svelte'

	interface Props {
		name?: string
		value?: string
		checked: boolean
		required?: string
		submitClicked: boolean
		children: Snippet
	}

	let { name, value, checked = $bindable(), required, submitClicked, children }: Props = $props()
</script>

<label>
	<input
		type="checkbox"
		{name}
		{value}
		{checked}
		onchange={e => (checked = e.currentTarget.checked)}
	/>
	<div class="label-text">
		{@render children()}
		<FormError visible={submitClicked && !!required && !checked}>{required}</FormError>
	</div>
</label>

<style lang="scss">
	label {
		display: flex;
		margin: 1.5rem 0 0 0;
		gap: 1rem;
		align-items: start;

		&:first-child {
			margin-top: 0;
		}
	}
	.label-text {
		display: block;
		margin: 0 0 0.5rem;
	}
</style>
