import type { Person } from '$lib/data'
import { client, type Entries } from '..'
import { withCache } from '../withCache'

export async function loadAllPersons(): Promise<Entries<Person>> {
	const persons = await withCache('persons', () => client.getEntries({ content_type: 'person' }))

	return persons as unknown as Entries<Person>
}
