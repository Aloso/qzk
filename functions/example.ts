import { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = _context => {
	return new Response(String(Math.random()) + ('DB' in (_context.platform ?? {})))
}
