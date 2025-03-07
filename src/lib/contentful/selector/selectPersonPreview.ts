import type { Person, PersonPreview } from '$lib/data'

export function selectPersonPreview(person: Person): PersonPreview {
	const { slug, name, role, photo } = person
	return { slug, name, role, photo }
}
