import { loadAllNavigations } from '$lib/contentful/loader'

export async function load() {
	return loadAllNavigations()
}
