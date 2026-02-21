<script lang="ts">
	import type { FormValuesPlace } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { m } from '$lib/paraglide/messages'

	interface Props {
		values: FormValuesPlace
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()

	$effect(() => {
		valid =
			values.placeType === 'QZ'
				? !!values.placeRoom
				: values.placeType === 'PHYSICAL'
					? !!values.placeName && !!values.placeAddress
					: true
	})
</script>

<div class="section-title">{m.pf_place()}</div>
<div class:professional>
	<label>
		<em class="required">{m.pf_place()}</em>
		<select bind:value={values.placeType}>
			<option value="QZ">{m.pf_place_qz()}</option>
			<option value="PHYSICAL">{m.pf_place_physical()}</option>
			<option value="ONLINE">{m.event_online()}</option>
		</select>
	</label>
	<label class:hidden={values.placeType !== 'QZ'}>
		<em class="required">{m.pf_room()}</em>
		<select bind:value={values.placeRoom} required={values.placeType === 'QZ'}>
			<option value={undefined}>{m.pf_none_selected()}</option>
			<option value="*innen-Raum">*innen-Raum</option>
			<option value="Gelber Raum">Gelber Raum</option>
			<option value="Blauer Raum">Blauer Raum</option>
			<option value="Rückzugsraum">Rückzugsraum</option>
			<option value="Ganzes Zentrum">Ganzes Zentrum</option>
		</select>
	</label>
	<label class:hidden={values.placeType !== 'PHYSICAL'}>
		<em class="required">{m.pf_place_name()}</em>
		<input type="text" bind:value={values.placeName} required={values.placeType === 'PHYSICAL'} />
	</label>
	<label class:hidden={values.placeType !== 'PHYSICAL'}>
		<em class="required">{m.pf_place_address()}</em>
		<textarea
			bind:value={values.placeAddress}
			placeholder={m.pf_place_address_placeholder()}
			rows="2"
			required={values.placeType === 'PHYSICAL'}
		></textarea>
	</label>
	<label class:hidden={values.placeType !== 'ONLINE'}>
		<em>{m.pf_place_url()}</em>
		<div class="input-group">
			<input type="text" bind:value={values.placeUrl} placeholder={m.pf_place_url_placeholder()} />
			<span class="optional">{m.pf_optional()}</span>
		</div>
	</label>
</div>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	label {
		display: flex;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	.professional label {
		width: 100%;
	}

	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: middle;
		flex-grow: 1;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	select,
	textarea,
	input[type='text'] {
		box-sizing: border-box;
		color: black;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 4.5rem;
		padding: 10px 0;
		vertical-align: middle;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		flex-grow: 1;
	}

	.optional {
		color: green;
		font-size: 90%;
	}
</style>
