import type { Person } from '$lib/data'
import { client, type Entries } from '..'

export async function loadAllPersons(): Promise<Entries<Person>> {
	const persons = await client.getEntries({
		content_type: 'person',
	})

	return persons as unknown as Entries<Person>
}
