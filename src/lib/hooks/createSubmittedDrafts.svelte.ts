import { browser } from '$app/environment'
import { onMount } from 'svelte'

export interface SubmittedDraft {
	key: string
	name: string
}

export function createSubmittedDrafts() {
	let submittedDrafts = $state<SubmittedDraft[]>(
		browser ? JSON.parse(localStorage.getItem('createdDraftKeys') ?? '[]') : [],
	)

	onMount(() => {
		submittedDrafts = JSON.parse(localStorage.getItem('createdDraftKeys') ?? '[]')
	})

	$effect(() => {
		localStorage.setItem('createdDraftKeys', JSON.stringify(submittedDrafts))
	})

	return {
		get items() {
			return submittedDrafts
		},
		add(key: string, name: string) {
			submittedDrafts.push({ key, name })
		},
		remove(key: string) {
			submittedDrafts = submittedDrafts.filter((d) => d.key !== key)
		},
		edit(key: string, name: string) {
			const draft = submittedDrafts.find((d) => d.key === key)
			if (draft) {
				draft.name = name
			}
		},
	}
}
