import { goto } from '$app/navigation'
import { onMount } from 'svelte'

interface Props {
	onMainMount: () => void
	onEventMount: (key: string) => void
}

export function createEventPlanningRouter({ onMainMount, onEventMount }: Props) {
	let key = $state<string>()

	function gotoEvent(newKey: string) {
		key = newKey
		goto(`/planen?key=${encodeURIComponent(newKey)}`)
		onEventMount(newKey)
	}

	function gotoMain() {
		key = undefined
		goto('/planen')
		onMainMount()
	}

	onMount(() => {
		const key = new URL(location.href).searchParams.get('key')
		if (key) {
			gotoEvent(key)
		}
	})

	return {
		get key() {
			return key
		},
		gotoEvent,
		gotoMain,
	}
}
