import { loadStatic } from '$lib/contentful/loader'

export async function load() {
	return loadStatic('planen')
}
