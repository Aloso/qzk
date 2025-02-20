import type { Auth } from '$lib/events'
import { onMount } from 'svelte'

export function createAdminCredentials() {
	let credentials = $state<Auth>()
	let isInit = $state(false)

	onMount(() => {
		const stored = localStorage.getItem('credentials')
		if (stored) {
			credentials = JSON.parse(stored)
		}
		isInit = true
	})

	return {
		get auth(): Auth | undefined {
			return credentials
		},
		set auth(newCredentials: Auth) {
			credentials = newCredentials
			localStorage.setItem('credentials', JSON.stringify(credentials))
		},
		get initialized(): boolean {
			return isInit
		},
		reset() {
			credentials = undefined
			localStorage.removeItem('credentials')
		},
	}
}
