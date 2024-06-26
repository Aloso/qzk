import type { Person } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client, type Item } from '..'

export async function loadPerson(slug: string): Promise<Item<Person>> {
	const persons = await client.getEntries({
		content_type: 'person',
		'fields.slug': slug,
	})

	if (persons.items.length === 0) {
		error(404, 'Not found')
	}

	return persons.items[0] as unknown as Item<Person>
}
