import type { Event } from '../types'

export async function submitDraft(draft: Event): Promise<{ key: string }> {
	const response = await fetch('https://events.queereszentrumkassel.de/draft', {
		method: 'POST',
		body: JSON.stringify(draft),
	})
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const data = await response.json()
	return data
}
