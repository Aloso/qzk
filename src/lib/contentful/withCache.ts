interface Cache {
	[key: string]: {
		expires: number
		value: unknown
	}
}

const cache: Cache = {}

export async function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
	const existing = cache[key]
	if (!existing) return await produce(key, fn)
	const now = Date.now()
	if (now < existing.expires) return existing.value as T
	return await produce(key, fn)
}

async function produce<T>(key: string, fn: () => Promise<T>): Promise<T> {
	const value = fn()
	cache[key] = {
		expires: Date.now() + 300_000,
		value,
	}
	return value
}
