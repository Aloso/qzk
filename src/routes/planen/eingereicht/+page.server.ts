import data from '$lib/contentful/data'
import type { StaticPageTransformed } from '$lib/data'
import { error } from '@sveltejs/kit'

export const prerender = true

export async function load(): Promise<StaticPageTransformed> {
	return data.staticPage.find(p => p.fields.slug === 'planen/eingereicht')?.fields ?? error(404)
}
