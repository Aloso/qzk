import { algoliasearch } from 'algoliasearch'

import type dataObj from '../../src/lib/contentful/data'
import { RichText } from '../../src/lib/contentful/data'
import sanitize from 'sanitize-html'

interface IndexObject {
	objectID: string
	title: string
	textContent: string
	description?: string
	authors?: string
}

export async function updateSearchIndex(data: typeof dataObj) {
	const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

	const objects: IndexObject[] = []

	for (const staticPage of data.staticPage) {
		if (shouldSkip(staticPage.fields.slug)) {
			continue
		}

		objects.push({
			objectID: `/${staticPage.fields.slug}`,
			title: staticPage.fields.name,
			textContent: cleanRichText(staticPage.fields.content),
			description: staticPage.fields.description,
		})
	}

	for (const blogPost of data.blogPost) {
		objects.push({
			objectID: `/blog/${blogPost.fields.published}/${blogPost.fields.slug}`,
			title: blogPost.fields.title,
			textContent: cleanRichText(blogPost.fields.content),
			authors: blogPost.fields.authorIds
				.map(authorId => data.person.find(p => p.sys.id === authorId)?.fields.name)
				.filter(name => name !== undefined)
				.join(', '),
		})
	}

	for (const person of data.person) {
		objects.push({
			objectID: `/person/${person.fields.slug}`,
			title: person.fields.name,
			textContent: person.fields.description ? cleanRichText(person.fields.description) : '',
		})
	}

	for (const object of objects) {
		const descLength = object.description?.length ?? 0
		if (object.textContent.length + descLength > 9400) {
			const sliced = object.textContent.slice(0, 9400 - descLength)

			const lastWordRegex = /(?<=[\p{Alpha}\p{M}\p{Nd}\p{Pc}])[\p{Alpha}\p{M}\p{Nd}\p{Pc}]*$/u
			sliced.replace(lastWordRegex, '')
			object.textContent = sliced
		}
	}

	await client.replaceAllObjects({
		indexName: 'queereszentrumkassel_de_pages',
		objects: objects as unknown as Record<string, unknown>[],
	})
}

function cleanRichText(richText: RichText): string {
	const html = richText.filter(c => typeof c === 'string').join('\n')

	const processed = html
		.replace(/(<\/(?:p|ul|ol|h[1-6]|blockquote|hr|table)>)/g, '$1<br /><br />')
		.replace(/<li>/g, '<li><br />• ')
		.replace(/(<t[dh]>)/g, '$1 – ')
		.replace(/<tr>/g, '<tr><br />')

	return sanitize(processed, { allowedTags: ['br'] })
		.replace(/<br \/>/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

function shouldSkip(slug: string) {
	return slug === 'index' || slug.startsWith('email/') || slug.startsWith('newsletter/')
}
