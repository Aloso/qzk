import { createClient } from 'contentful'
export * from './types'

const isDev = process.env.NODE_ENV === 'development'

export const client = createClient({
	space: import.meta.env.VITE_CONTENTFUL_SPACE_ID,
	accessToken: isDev
		? import.meta.env.VITE_CONTENTFUL_TOKEN_PREVIEW
		: import.meta.env.VITE_CONTENTFUL_TOKEN,
	host: isDev ? 'preview.contentful.com' : 'cdn.contentful.com',
})
