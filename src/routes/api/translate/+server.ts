import { json } from '@sveltejs/kit'
import { escapeHtml, sanitizeHtml, sanitizeHtmlPlain } from '$lib/utils/sanitize'
import { error } from '@sveltejs/kit'
import z from 'zod'

export interface TranslateRequest {
	parts: TranslatePart[]
	source_lang?: string
	target_lang: string
}

export interface TranslateResponse {
	parts: TranslateResult[]
}

export interface TranslatePart {
	text: string
	html?: boolean
}

export interface TranslateResult {
	text: string
	html: boolean
}

const translationSchema = z.object({
	parts: z.array(
		z.object({
			text: z.string(),
			html: z.boolean().optional(),
		}),
	),
	source_lang: z.enum(['de', 'en']).optional(),
	target_lang: z.enum(['de', 'en']),
})

function parseTranslate(data: unknown): TranslateRequest {
	try {
		return translationSchema.parse(data)
	} catch (error) {
		const { issues } = error as z.ZodError
		throw json({ errors: issues }, { status: 400 })
	}
}

function toHtmlText(part: TranslatePart) {
	return part.html ? part.text : escapeHtml(part.text)
}

// translate
export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const { parts, source_lang, target_lang } = parseTranslate(await request.json())

	const totalLength = parts.reduce((acc, part) => acc + part.text.length, 0)
	if (totalLength > 10_000 || parts.length > 10) {
		error(413, 'Exceeded limit of 10 texts or 10,000 characters')
	}

	const response = await fetch('https://api-free.deepl.com/v2/translate', {
		method: 'POST',
		headers: {
			Authorization: `DeepL-Auth-Key ${platform.env.DEEPL_API_KEY}`,
			'User-Agent': 'QueeresZentrumKassel/1.0.0',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			text: parts.map(toHtmlText),
			source_lang,
			target_lang,
			tag_handling: 'html',
			tag_handling_version: 'v2',
		}),
	})

	if (response.ok) {
		const { translations } = (await response.json()) as { translations: { text: string }[] }
		return json({
			parts: translations.map((t, i) => ({
				text: parts[i].html ? t.text : sanitizeHtmlPlain(t.text),
			})),
		})
	} else {
		error(response.status)
	}
}
