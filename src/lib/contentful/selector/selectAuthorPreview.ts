import type { Author, AuthorPreview } from '$lib/data'
import type { Item } from '..'

export function selectAuthorPreview(author: Item<Author>): AuthorPreview {
	const { slug, name, role, photo } = author.fields
	return { slug, name, role, photo }
}
