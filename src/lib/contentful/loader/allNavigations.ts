import type { Navigation, Navigations, TypedNavigation } from '$lib/data'
import { client, type Entries } from '..'

export async function loadAllNavigations(): Promise<Navigations> {
	const navigations = await client.getEntries({
		content_type: 'navigation',
	})

	const { items } = navigations as unknown as Entries<Navigation>

	const header = items.find(item => item.fields.name === 'Header')
	const footer = items.find(item => item.fields.name === 'Footer')

	return {
		header: parseText(header?.fields.links ?? ''),
		footer: parseText(footer?.fields.links ?? ''),
	}
}

function parseText(text: string) {
	const items: TypedNavigation[] = []
	let currentItem: TypedNavigation | undefined = undefined

	for (const line of text.split('\n')) {
		const trimmed = line.trim()
		if (trimmed === '') {
			continue
		}

		if (line.startsWith(':')) {
			const text = line.slice(1).trim()
			currentItem = { text, children: [] }
			items.push(currentItem)
		} else {
			const [href, text] = splitOnce(trimmed, ' ')
			if (line.startsWith('  ')) {
				if (currentItem === undefined) continue

				currentItem.children.push({ href, text, children: [] })
			} else {
				currentItem = { href, text, children: [] }
				items.push(currentItem)
			}
		}
	}
	return items
}

function splitOnce(text: string, char: string) {
	const splitPos = text.indexOf(char)
	const p1 = text.slice(0, splitPos)
	const p2 = text.slice(splitPos + 1)
	return [p1, p2] as const
}
