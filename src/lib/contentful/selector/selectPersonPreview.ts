import type { Person, PersonPreview } from '$lib/data'
import type { Item } from '..'

export function selectPersonPreview(person: Item<Person>): PersonPreview {
	const { slug, name, role, photo } = person.fields
	return { slug, name, role, photo }
}
