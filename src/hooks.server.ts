import { paraglideMiddleware } from '#lib/paraglide/server.js'
import type { Handle } from '@sveltejs/kit/hooks'

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		return resolve(
			{ ...event, request: localizedRequest },
			{
				transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale),
			},
		)
	})

export const handle: Handle = handleParaglide
