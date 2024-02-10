import type { BlogPost } from '$lib/data'
import { client, type Entries } from '..'

interface Options {
	limit?: number
	authorIds?: string[]
	linksTo?: string
	tags?: string[]
}

export async function loadAllBlogPosts({
	limit,
	authorIds,
	linksTo,
	tags,
}: Options): Promise<Entries<BlogPost>> {
	const args: Record<string, unknown> = {
		content_type: 'blogPost',
		order: ['-fields.published'],
	}
	if (authorIds) {
		args['fields.authors.sys.id[in]'] = authorIds
	}
	if (limit) {
		args.limit = limit
	}
	if (linksTo) {
		args.links_to_entry = linksTo
	}
	if (tags) {
		args['metadata.tags.sys.id[in]'] = tags
	}

	const posts = await client.getEntries(args)
	return posts as unknown as Entries<BlogPost>
}
