import { defineEnvVars } from '@sveltejs/kit/env'
import z from 'zod'

export const variables = defineEnvVars({
	ALGOLIA_APP_ID: {},
	ALGOLIA_API_KEY: {},
	DEEPL_API_KEY: {},

	CONTACT_FORM_RECIPIENT: { static: true },
	SMTP_USERNAME: { static: true },
	SMTP_PASSWORD: { static: true },
	SMTP_HOST: { static: true },

	TURNSTILE_SECRET_KEY: { schema: z.string().optional() },
})
