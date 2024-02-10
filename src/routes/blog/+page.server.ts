import { loadAllBlogPosts } from '$lib/contentful/loader'

export async function load() {
	return loadAllBlogPosts({ limit: 20 })
}
