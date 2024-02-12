export function clearFilterParamsIn(src: string, hash: string, regExps: RegExp[]) {
	for (const regExp of regExps) {
		if (regExp.test(hash) && regExp.test(src)) {
			src = src.replace(regExp, '')
		}
	}
	return src
}

export function hashFiltersToSearchString(hash: string, regExps: RegExp[]) {
	let params = ''

	for (const regExp of regExps) {
		const filterMatch = hash.match(regExp)
		if (filterMatch) {
			params += '&' + filterMatch[0]
		}
	}
	return params
}
