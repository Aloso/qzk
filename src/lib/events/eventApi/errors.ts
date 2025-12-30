interface Error {
	code: string
	message?: string
}

export function formatErrors(msg: unknown) {
	if (msg && typeof msg === 'object' && 'errors' in msg) {
		return (msg as { errors: Error[] }).errors.map(e => e.message ?? e.code).join('\n')
	}
	return 'Unbekannter Fehler'
}
