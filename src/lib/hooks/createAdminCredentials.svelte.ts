import type { Auth } from '$lib/events'
import { onMount } from 'svelte'

export function createAdminCredentials() {
	let credentials = $state<Auth>()

	onMount(() => {
		const stored = localStorage.getItem('credentials')
		if (stored) {
			credentials = JSON.parse(stored)
		}
	})

	return {
		get auth(): Auth | undefined {
			return credentials
		},
		set auth(newCredentials: Auth) {
			credentials = newCredentials
			localStorage.setItem('credentials', JSON.stringify(credentials))
		},
		reset() {
			credentials = undefined
			localStorage.removeItem('credentials')
		},
	}
}
