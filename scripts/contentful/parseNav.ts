import type { Item, Navigation, TopLevelNavItem } from './types'

export interface Navigations {
	header: TypedNavigation[]
	footer: TypedNavigation[]
}

export interface TypedNavigation {
	href?: string
	de: string
	en: string
	children?: TypedNavigation[]
}

export function getAllNavigations(navs: Item<Navigation>[]): Navigations {
	const header = navs.find(item => item.fields.name === 'Header')
	const footer = navs.find(item => item.fields.name === 'Footer')

	return {
		header: header?.fields.linksObject?.map(transform) ?? [],
		footer: footer?.fields.linksObject?.map(transform) ?? [],
	}
}

function transform(item: TopLevelNavItem): TypedNavigation {
	const href = item.path === '' ? undefined : item.path
	const children = item.children.map(c => ({
		de: c.name,
		en: c.nameEn,
		href: c.path === '' ? undefined : c.path,
	}))
	return children.length > 0
		? { de: item.name, en: item.nameEn, href, children }
		: { de: item.name, en: item.nameEn, href }
}
