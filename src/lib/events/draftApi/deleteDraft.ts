import { host } from '.'

export async function deleteDraft(key: string): Promise<boolean> {
	const url = new URL(host + '/draft')
	url.searchParams.set('key', key)
	const response = await fetch(url, { method: 'DELETE' })

	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	return true
}
