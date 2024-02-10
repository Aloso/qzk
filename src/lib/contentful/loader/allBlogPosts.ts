import type { BlogPost } from '$lib/data'
import { client, type Entries } from '..'

interface Options {
	limit?: number
	authorId?: string
}

export async function loadAllBlogPosts({ limit, authorId }: Options): Promise<Entries<BlogPost>> {
	const args: Record<string, unknown> = {
		content_type: 'blogPost',
		order: ['fields.published'],
	}
	if (authorId) {
		args['fields.authors.sys.id'] = authorId
	}
	if (limit) {
		args.limit = limit
	}

	const posts = await client.getEntries(args)
	return posts as unknown as Entries<BlogPost>
}
