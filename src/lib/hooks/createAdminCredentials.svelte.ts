import type { Auth } from '$lib/events'
import { onMount } from 'svelte'

let credentials = $state<Auth>()

export function createAdminCredentials() {
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
