import { error } from '@sveltejs/kit'
import { parseState } from './event'

type Env = App.Platform['env']

interface Credentials {
	user: string
	password: string
}

export function tryAuthentication(request: Request, env: Env): boolean {
	const credentials = getCredentials(request)
	if (!credentials) return false
	return verifyCredentials(env, credentials)
}

export function getCredentials(request: Request): Credentials | undefined {
	const auth = request.headers.get('Authorization') ?? getCookie(request.headers.get('Cookie'))
	const match = auth?.match(/^(?<user>[^@]*?)@(?<password>.*)$/)
	if (!match) {
		return
	}

	const { user, password } = match.groups!
	return { user, password }
}

export function verifyCredentials(env: Env, { user, password }: Credentials): boolean {
	const variable = `USER__${user}` as const
	return variable in env && env[variable] === password
}

function getCookie(cookieString: string | null): string | undefined {
	if (!cookieString) return

	const match = cookieString.match(/_qzkCred=(.*?)(?:;|$)/)?.[1]
	if (!match) return

	try {
		return atob(match)
	} catch {
		return
	}
}

export function queryKey(receiver: Request | URLSearchParams) {
	if (receiver instanceof Request) {
		receiver = new URL(receiver.url).searchParams
	}
	return receiver.get('key') ?? undefined
}

export function queryState(receiver: Request | URLSearchParams) {
	if (receiver instanceof Request) {
		receiver = new URL(receiver.url).searchParams
	}
	const state = receiver.get('state')
	if (!state) return
	return parseState(state)
}

export function queryNumber(params: URLSearchParams, name: string) {
	const value = params.get(name)
	if (value == null) return
	if (Number.isNaN(value)) {
		error(400, `Bad query parameter ${name}`)
	}
	return +value
}
