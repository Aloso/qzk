import { goto } from '$app/navigation'
import { onMount } from 'svelte'

interface Props {
	onMount: (key: string) => void
}

export function createEventPlanningRouter({ onMount: customOnMount }: Props) {
	let key = $state<string>()

	function gotoEvent(newKey: string) {
		key = newKey
		goto(`/planen/eingereicht?key=${encodeURIComponent(newKey)}`)
		customOnMount(newKey)
	}

	onMount(() => {
		const key = new URL(location.href).searchParams.get('key')
		if (key) {
			gotoEvent(key)
		} else {
			goto('/planen', { replaceState: true })
		}
	})

	return {
		get key() {
			return key
		},
		gotoEvent,
	}
}
