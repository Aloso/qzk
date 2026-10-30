import { deLocalizeUrl } from '#lib/paraglide/runtime.js'

export const reroute = (request: Request) => deLocalizeUrl(request.url).pathname
