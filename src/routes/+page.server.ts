import { loadAllBlogPosts } from '$lib/contentful/loader'
import { loadGeneralInfo } from '$lib/contentful/loader/generalInfo'
import { renderDataToString } from '$lib/contentful/render'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import { transformGeneralInfo } from '$lib/contentful/transformGeneralInfo'
import type { BlogPostPreviewTransformed, GeneralInfoTransformed } from '$lib/data'

export const prerender = true

export interface Data {
	generalInfo: GeneralInfoTransformed
	posts: BlogPostPreviewTransformed[]
}

export async function load(): Promise<Data> {
	const generalInfo = await loadGeneralInfo()
	const postItems = await loadAllBlogPosts({ limit: 2 })
	const posts = postItems.items.map(selectBlogPostPreview)

	return {
		generalInfo: transformGeneralInfo(generalInfo.fields),
		posts: posts.map(post => ({ ...post, teaser: renderDataToString(post.teaser, 700) })),
	}
}
