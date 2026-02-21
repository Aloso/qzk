import type {
	TranslatePart,
	TranslateRequest,
	TranslateResponse,
	TranslateResult,
} from '../../routes/api/translate/+server'

type TranslationError = 'TOO_MANY_REQUESTS' | 'QUOTA_EXCEEDED' | 'CONTENT_TOO_LARGE' | 'INTERNAL'

export async function translate(
	parts: TranslatePart[],
	source_lang: string | undefined,
	target_lang: string,
): Promise<TranslateResult[] | TranslationError> {
	try {
		const response = await fetch(`${location.protocol}//${location.host}/api/translate`, {
			method: 'POST',
			body: JSON.stringify({ parts, source_lang, target_lang } satisfies TranslateRequest),
		})

		if (response.ok) {
			const result = (await response.json()) as TranslateResponse
			return result.parts
		} else if (response.status === 429) {
			return 'TOO_MANY_REQUESTS'
		} else if (response.status === 456) {
			return 'QUOTA_EXCEEDED'
		} else if (response.status === 413) {
			return 'CONTENT_TOO_LARGE'
		} else {
			return 'INTERNAL'
		}
	} catch (error) {
		return 'INTERNAL'
	}
}
