import dirTree from 'directory-tree'
import * as fs from 'node:fs'

const baseRoute = '/'
const routes: string[] = [baseRoute]

const disallowed = fs
	.readFileSync('static/robots.txt')
	.toString('utf8')
	.split('\n')
	.filter(line => line.startsWith('Disallow:'))
	.map(line => line.replace(/^Disallow:\s*/, ''))

const lessImportant = ['/datenschutz', '/impressum']

function getSitemapXML(domain: string, routes: string[]) {
	let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
	sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
	routes.forEach(route => {
		if (route === '/index') return
		if (disallowed.includes(route + '/') || disallowed.some(d => route.startsWith(d))) return

		const prio =
			route === '/'
				? '1.0'
				: /^\/[^/]+$/.test(route) && !lessImportant.includes(route)
					? '0.7'
					: '0.4'
		sitemap += getSitemapUrl(domain + route, prio, route === '/blog')
	})
	sitemap += '</urlset>\n'
	return sitemap
}

function getSitemapUrl(location: string, prio: string, changesOften = false) {
	const url = `  <url><loc>${location}</loc><priority>${prio}</priority>${changesOften ? '<changefreq>weekly</changefreq>' : ''}</url>\n`
	return url
}

function getEndpoints(tree: dirTree.DirectoryTree, route: string) {
	tree.children!.forEach(child => {
		if (child.name.endsWith('.html')) {
			routes.push(route + child.name.replace(/\.html$/, ''))
		}
		if (child.children?.length) {
			getEndpoints(child, route + child.name + '/')
		}
	})
}

const tree = dirTree('./build')
getEndpoints(tree, baseRoute)

const sitemap = getSitemapXML('https://queereszentrumkassel.de', routes)

fs.writeFileSync('build/sitemap.xml', sitemap)
