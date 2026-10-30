import data from '#lib/contentful/data.js'
import type { StaticPageTransformed } from '#lib/data/index.js'
import { error } from '@sveltejs/kit'

export const prerender = true

export async function load(): Promise<StaticPageTransformed> {
	return data.staticPage.find(p => p.fields.slug === 'planen')?.fields ?? error(404)
}
