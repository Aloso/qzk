import data from '$lib/contentful/data'

export async function load() {
	return data.staticPage.find(p => p.fields.slug === 'planen/eingereicht')
}
