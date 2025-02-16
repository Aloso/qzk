import type { StaticPage, StaticPageTransformed } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client } from '..'
import { renderData } from '../render'
import { withCache } from '../withCache'

export async function loadStatic(
	slug: string | null,
	width: number,
): Promise<StaticPageTransformed> {
	if (slug === 'index') {
		error(404, 'Not found')
	}

	const pages = await withCache(`loadStatic-${slug ?? 'index'}`, () =>
		client.getEntries({
			content_type: 'staticPage',
			'fields.slug': slug ?? 'index',
		}),
	)

	if (pages.items.length === 0) {
		error(404, 'Not found')
	}

	const page = pages.items[0].fields as unknown as StaticPage
	return { ...page, parts: renderData(page.content, width) }
}
