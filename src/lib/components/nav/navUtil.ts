import type { TypedNavigation } from '$lib/data'

const startMatches = new Set<string | undefined>(['/blog', '/autor', '/newsletter'])

export function isNavItem(item: TypedNavigation, url: string) {
	if (item.href === url) return true
	if (startMatches.has(item.href) && url.startsWith(item.href!)) return true
	if (item.children.some((c) => isNavItem(c, url))) return true
	return false
}
