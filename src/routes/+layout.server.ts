import data from '#lib/contentful/data.js'

export async function load() {
	return data.navigations
}
