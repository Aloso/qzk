export function parseUrl(url: string) {
	if (/^\w+:/.test(url)) return new URL(url)
	const defaultProtocol = url.includes('@') && !url.includes('/') ? 'mailto:' : 'https://'
	return new URL(defaultProtocol + url)
}
