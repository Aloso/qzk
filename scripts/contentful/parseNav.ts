import { Item, Navigation, TopLevelNavItem } from './types'

export interface Navigations {
	header: TypedNavigation[]
	footer: TypedNavigation[]
}

export interface TypedNavigation {
	href?: string
	text: string
	children: TypedNavigation[]
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
	return {
		text: item.name,
		href: item.path === '' ? undefined : item.path,
		children: item.children.map(c => ({
			text: c.name,
			href: c.path === '' ? undefined : c.path,
			children: [],
		})),
	}
}
