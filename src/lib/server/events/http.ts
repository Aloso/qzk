type Env = App.Platform['env']

export function authenticate(request: Request, env: Env) {
	const authenticated = tryAuthentication(request, env)
	if (!authenticated) {
		throw new Response('Unauthorized', { status: 401 })
	}
}

export function tryAuthentication(request: Request, env: Env): boolean {
	const auth = request.headers.get('Authorization')
	const match = auth?.match(/^(?<user>[^@]*?)@(?<password>.*)$/)
	if (!match) {
		return false
	}

	const { user, password } = match.groups!
	const variable = `USER__${user}` as const
	return variable in env && env[variable] === password
}

export function queryKey(receiver: Request | URLSearchParams) {
	if (receiver instanceof Request) {
		receiver = new URL(receiver.url).searchParams
	}
	return receiver.get('key') ?? undefined
}

export function queryNumber(params: URLSearchParams, name: string) {
	const value = params.get(name)
	if (value == null) return
	if (Number.isNaN(value)) {
		throw new Response(`Bad query parameter ${name}`, { status: 400 })
	}
	return +value
}
